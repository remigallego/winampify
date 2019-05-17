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
import { AppState } from "../reducers";
import {
  CLOSE_EXPLORER,
  OPEN_EXPLORER,
  SET_MORE_ITEMS,
  UPDATE_POSITION
} from "../reducers/explorer";
import {
  LOADING_PAGINATION,
  SET_SEARCH,
  UPDATE_PAGINATION
} from "../reducers/search-pagination";
import { ACTION_TYPE } from "../types";
import { generateExplorerId, getActiveExplorerId } from "../utils/explorer";

export function createNewExplorer(id?: string, x?: number, y?: number): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: OPEN_EXPLORER,
      payload: {
        id: id ? id : generateExplorerId(),
        x: x && x - 100 > 0 ? x - 100 : 0,
        y: y && y - 100 > 0 ? y - 100 : 0
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
  actionType: ACTION_TYPE,
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
    let files;
    let title;

    switch (actionType) {
      case ACTION_TYPE.ARTIST: {
        if (!uri) return;
        files = await getAlbumsFromArtist(uri);
        title = (await getArtistData(uri)).name;
        break;
      }
      case ACTION_TYPE.ALBUM: {
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
      case ACTION_TYPE.TOP: {
        files = await getTopArtistsFromMe();
        title = "My Top Artists";
        break;
      }
      case ACTION_TYPE.FOLLOWING: {
        files = await getFollowedArtistsFromMe();
        title = "Following";
        break;
      }
      case ACTION_TYPE.RECENTLY_PLAYED: {
        const recentlyPlayed = await getMyRecentlyPlayed();
        files = recentlyPlayed.map(obj => obj.track);
        title = "Recently Played";
        break;
      }
      case ACTION_TYPE.LIBRARY_TRACKS: {
        const items = await getMyLibraryTracks();
        files = items.map(item => item.track);
        title = "My Saved Tracks";
        break;
      }
      case ACTION_TYPE.LIBRARY_ALBUMS: {
        const items = await getMyLibraryAlbums();
        files = items.map(item => item.album);
        title = "My Saved Albums";
        break;
      }
    }

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        title,
        query: null
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

export function setSearchResults(query: string, types: string[]) {
  return async (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const explorerId = getActiveExplorerId(getState());

    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const results = await searchFor(query, types, 0);

    const albums = results.find(obj => obj.albums !== undefined);
    const tracks = results.find(obj => obj.tracks !== undefined);
    const artists = results.find(obj => obj.artists !== undefined);

    // tslint:disable-next-line: no-unused-expression

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
        query
      }
    });

    dispatch({
      type: SET_SEARCH,
      payload: {
        id: explorerId,
        query,
        types,
        album: albums ? { total: albums.albums.total, current: 20 } : {},
        track: tracks ? { total: tracks.tracks.total, current: 20 } : {},
        artist: artists ? { total: artists.artists.total, current: 20 } : {}
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

export function setMoreSearchResults(type: "album" | "artist" | "track") {
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

export function getArtistFromId(id: string) {
  return () => {
    getArtistData(id).then(result => result);
  };
}

export function selectFile(fileId: string, explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: "SET_SELECTED_EXPLORER",
      payload: {
        id: explorerId,
        selected: fileId
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
