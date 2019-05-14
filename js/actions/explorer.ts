import {
  UNSET_FOCUS_EXPLORER,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  LOADING,
  SET_ITEMS,
  GO_PREVIOUS_STATE
} from "../actionTypes";
import {
  getAlbumsFromArtist,
  getTracksFromAlbum,
  getAlbumData,
  getTopArtistsFromMe,
  getFollowedArtistsFromMe,
  getMyRecentlyPlayed,
  getMyLibraryAlbums,
  getMyLibraryTracks,
  getArtistData,
  searchFor
} from "../api/apiFunctions";
import { generateExplorerId, getActiveExplorerId } from "../utils/explorer";
import {
  OPEN_EXPLORER,
  CLOSE_EXPLORER,
  UPDATE_POSITION
} from "../reducers/explorer";
import { Dispatch, Action } from "redux";
import { AppState } from "../reducers";

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

// what kind of folder was clicked on
export enum ACTION_TYPE {
  ALBUM,
  ARTIST,
  TOP,
  FOLLOWING,
  RECENTLY_PLAYED,
  LIBRARY_ALBUMS,
  LIBRARY_TRACKS
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
        files = recentlyPlayed.map(derivedTrack => derivedTrack.track);
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
        search: false
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
    let explorerId = getActiveExplorerId(getState());

    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    let arrayOfSearchResponses = await searchFor(query, types, 0);

    let files = arrayOfSearchResponses
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
        search: true
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
    let explorerId = getActiveExplorerId(getState());
    dispatch({ type: GO_PREVIOUS_STATE, payload: { id: explorerId } });
  };
}
