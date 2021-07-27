import { Action, Dispatch } from "redux";
import {
  GO_PREVIOUS_STATE,
  LOADING,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  SET_ITEMS,
  UNSET_FOCUS_EXPLORER
} from "../actionTypes";
import {
  getAlbumData,
  getAlbumsFromArtist,
  getArtistData,
  getFollowedArtistsFromMe,
  getMyLibraryAlbums,
  getMyLibraryTracks,
  getMyRecentlyPlayed,
  getTopArtistsFromMe,
  getTracksFromAlbum,
  searchFor
} from "../api/apiFunctions";
import {
  addTracksToPlaylist,
  getMyPlaylists,
  getPlaylist,
  getTracksFromPlaylist
} from "../api/playlists";
import { AppState } from "../reducers";
import {
  CLOSE_EXPLORER,
  OPEN_EXPLORER,
  RESET_SCROLL_OFFSET,
  SET_MORE_ITEMS,
  SET_SCROLL_OFFSET,
  UPDATE_POSITION,
  UPDATE_OFFSET_PARAMETER,
  COMMIT_OFFSET_PARAMETER
} from "../reducers/explorer";
import {
  LOADING_PAGINATION,
  SET_SEARCH,
  UPDATE_PAGINATION
} from "../reducers/search-pagination";
import { OPEN_FOLDER_ACTION, SimplifiedTrack, TrackFile } from "../types";
import { generateExplorerId, getActiveExplorerId } from "../utils/explorer";
import { getSkins } from "./../api/skins";
import { Filter } from "./search-pagination";

export function createNewExplorer(id?: string, x?: number, y?: number): any {
  return (dispatch: Dispatch<Action>) => {
    const explorerId = id ? id : generateExplorerId();
    dispatch({
      type: OPEN_EXPLORER,
      payload: {
        id: explorerId,
        x: x && x - 100 > 0 ? x - 100 : 0,
        y: y && y - 100 > 0 ? y - 100 : 0
      }
    });
    dispatch({
      type: SET_SEARCH,
      payload: {
        id: explorerId,
        query: "",
        types: ["album", "track", "artist", "playlist"],
        album: {},
        track: {},
        artist: {}
      }
    });
  };
}

export function closeExplorer(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: CLOSE_EXPLORER,
      payload: {
        id: explorerId
      }
    });
  };
}

// TODO: Should be Windows action
export function updatePosition(x: number, y: number, explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: UPDATE_POSITION,
      payload: {
        id: explorerId,
        x,
        y
      }
    });
  };
}
// TODO: Should be Windows action
export function updateSize(width: number, height: number, explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: "UPDATE_SIZE",
      id: explorerId,
      width,
      height
    });
  };
}

// TODO: Should be Windows action
export function unsetFocusExplorer(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: UNSET_FOCUS_EXPLORER,
      id: explorerId
    });
  };
}

export function setItems(
  actionType: OPEN_FOLDER_ACTION,
  uri?: string,
  explorerId?: string,
  e?: any
) {
  return async (dispatch: Dispatch<Action>, getState: () => AppState) => {
    if (!explorerId) {
      explorerId = generateExplorerId();
      if (e) {
        dispatch(
          createNewExplorer(
            explorerId,
            e.nativeEvent.clientX,
            e.nativeEvent.clientY
          )
        );
      } else dispatch(createNewExplorer(explorerId));
    } else dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });

    dispatch({ type: LOADING, id: explorerId });
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        query: null,
        uri,
        action: actionType
      }
    });

    let files;
    let title;
    let dropEnabled = false;
    switch (actionType) {
      case OPEN_FOLDER_ACTION.ARTIST: {
        if (!uri) return;
        files = await getAlbumsFromArtist(uri);
        const data = await getArtistData(uri);
        title = data.name;
        break;
      }
      case OPEN_FOLDER_ACTION.ALBUM: {
        if (!uri) return;
        const tracks = await getTracksFromAlbum(uri);
        const albumData = await getAlbumData(uri);
        const imageFile = {
          name: `${albumData.artists[0].name} - ${albumData.name}`,
          type: "image",
          url: albumData.images[0].url
        };

        files = [...tracks, imageFile];
        title = `${albumData.artists[0].name} - ${albumData.name}`;
        break;
      }
      case OPEN_FOLDER_ACTION.PLAYLIST: {
        if (!uri) return;
        const items = await getTracksFromPlaylist(uri);
        const playlist = await getPlaylist(uri);
        files = items.map(item => item.track);
        title = playlist.name;
        if (playlist.owner.id === getState().user.id) {
          dropEnabled = true;
        }
        break;
      }
      case OPEN_FOLDER_ACTION.TOP: {
        files = await getTopArtistsFromMe();
        title = "My Top Artists";
        break;
      }
      case OPEN_FOLDER_ACTION.FOLLOWING: {
        files = await getFollowedArtistsFromMe();
        title = "Following";
        break;
      }
      case OPEN_FOLDER_ACTION.RECENTLY_PLAYED: {
        const recentlyPlayed = await getMyRecentlyPlayed();
        files = recentlyPlayed.map(obj => obj.track);
        title = "Recently Played";
        break;
      }
      case OPEN_FOLDER_ACTION.LIBRARY_TRACKS: {
        const items = await getMyLibraryTracks();
        files = items.map(item => item.track);
        title = "My Saved Tracks";
        break;
      }
      case OPEN_FOLDER_ACTION.LIBRARY_ALBUMS: {
        const items = await getMyLibraryAlbums();
        files = items.map(item => item.album);
        title = "My Saved Albums";
        break;
      }
      case OPEN_FOLDER_ACTION.USER_PLAYLISTS: {
        files = await getMyPlaylists();
        title = "My Playlists";
        break;
      }
      case OPEN_FOLDER_ACTION.OPEN_SKINS: {
        files = await getSkins();
        title = "Winamp Skins";
        break;
      }
    }

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        title,
        dropEnabled
      }
    });

    dispatch({
      type: RESET_SCROLL_OFFSET,
      payload: {
        id: explorerId
      }
    });

    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files
      }
    });
  };
}

export function setSearchResults(inputQuery?: string) {
  return async (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const explorerId = getActiveExplorerId(getState());

    const query = inputQuery ?? getState().searchPagination[explorerId].query;

    if (!query) return;
    const filter: Filter = getState().searchPagination[explorerId].filter;

    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const results = await searchFor(query, filter.types, 0);

    const albums = results.find(obj => obj.albums !== undefined);
    const tracks = results.find(obj => obj.tracks !== undefined);
    const artists = results.find(obj => obj.artists !== undefined);
    const playlists = results.find(obj => obj.playlists !== undefined);

    const files = results
      .map(searchResponse =>
        Object.keys(searchResponse)
          .map(key => searchResponse[key])
          .map(obj => obj.items)
      )
      .flat(2);

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        title: `Search: ${query}`,
        query,
        dropEnabled: false
      }
    });

    dispatch({
      type: SET_SEARCH,
      payload: {
        id: explorerId,
        query,
        types: filter.types,
        album: albums ? { total: albums.albums.total, current: 20 } : {},
        track: tracks ? { total: tracks.tracks.total, current: 20 } : {},
        artist: artists ? { total: artists.artists.total, current: 20 } : {},
        playlist: playlists
          ? { total: playlists.playlists.total, current: 20 }
          : {}
      }
    });

    dispatch({
      type: RESET_SCROLL_OFFSET,
      payload: {
        id: explorerId
      }
    });

    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files
      }
    });
  };
}

export function setMoreSearchResults(
  type: "album" | "artist" | "track" | "playlist"
) {
  return async (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const id = getActiveExplorerId(getState());
    const query = getState().explorer.byId[id].query;
    const search = getState().searchPagination[id];

    dispatch({
      type: LOADING_PAGINATION,
      payload: { id, type }
    });

    const results = await searchFor(query, [type], search[type].current);

    const files = results
      .map(searchResponse =>
        Object.keys(searchResponse)
          .map(key => searchResponse[key])
          .map(obj => obj.items)
      )
      .flat(2);

    dispatch({
      type: UPDATE_PAGINATION,
      payload: {
        id,
        type,
        current: search[type].current + files.length
      }
    });

    dispatch({
      type: SET_MORE_ITEMS,
      payload: {
        id,
        files
      }
    });
  };
}

export function setTracksToPlaylist(
  playlistId: string,
  tracks: SimplifiedTrack[],
  explorerId: string
) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: LOADING, id: explorerId });
    await addTracksToPlaylist(playlistId, tracks);
    const items = await getTracksFromPlaylist(playlistId);
    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: items.map(item => item.track)
      }
    });
  };
}

export function getArtistFromId(id: string) {
  return () => {
    getArtistData(id).then(result => result);
  };
}

export function selectFile(fileIds: string[], explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: "SET_SELECTED_EXPLORER",
      payload: {
        id: explorerId,
        selectedFiles: fileIds
      }
    });
  };
}

export function goPreviousState() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const explorerId = getActiveExplorerId(getState());
    dispatch({ type: GO_PREVIOUS_STATE, payload: { id: explorerId } });
  };
}

export function setScrollOffset(scrollOffset: number, id: string) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const explorerId = getActiveExplorerId(getState());
    dispatch({ type: SET_SCROLL_OFFSET, payload: { id, scrollOffset } });
  };
}

export function updateOffsetParameter(
  id: string,
  title: string,
  offset: number
) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    dispatch({ type: UPDATE_OFFSET_PARAMETER, payload: { id, title, offset } });
  };
}
export function commitOffsetParameter(id: string, title: string) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    dispatch({ type: COMMIT_OFFSET_PARAMETER, payload: { id, title } });
  };
}
