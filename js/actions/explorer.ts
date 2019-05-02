import {
  UNSET_FOCUS_EXPLORER,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  LOADING,
  SET_ITEMS
} from "../actionTypes";
import {
  getSearchResult,
  getAlbumsFromArtist,
  getTracksFromAlbum,
  getAlbumData,
  getTopArtistsFromMe,
  getFollowedArtistsFromMe,
  getMyRecentlyPlayed,
  getMyLibraryAlbums,
  getMyLibraryTracks,
  getArtistData
} from "../SpotifyApi/spotifyFunctions";
import { generateExplorerId } from "../utils/explorer";
import { OPEN_EXPLORER } from "../reducers/explorer";
import { Dispatch, Action } from "redux";
import { AppState } from "../reducers";

export function createNewExplorer(id?: string, x?: number, y?: number): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: OPEN_EXPLORER,
      id: id ? id : generateExplorerId(),
      x: x ? x - 100 : 0,
      y: y ? y - 100: 0
    });
  };
}

export function closeExplorer(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: "CLOSE_EXPLORER",
      id: explorerId
    });
  };
}

export function updatePosition(x: number, y: number, explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: "UPDATE_POSITION",
      id: explorerId,
      x,
      y
    });
  };
}

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

export function unsetFocusExplorer(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: UNSET_FOCUS_EXPLORER,
      id: explorerId
    });
  };
}

export function searchOnSpotify(
  search: string,
  type: string,
  offset: string,
  explorerId: string
) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    dispatch({ type: "SEARCH", id: explorerId });
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "search",
        title: search,
        image: null
      }
    });
    if (offset === "0") dispatch({ type: LOADING, id: explorerId });
    getSearchResult(search, type, offset).then(results => {
      let albums = getState().explorer.byId[explorerId].albums;
      let artists = getState().explorer.byId[explorerId].artists;
      let playlists = getState().explorer.byId[explorerId].playlists;
      let tracks = getState().explorer.byId[explorerId].tracks;
      if (results.artists) {
        artists = results.artists.items;
        const stateArtists = getState().explorer.byId[explorerId].artists;
        if (offset !== "0") {
          artists.map((artist: any) => stateArtists.push(artist));
          artists = stateArtists;
        }
      }
      if (results.playlists) {
        playlists = results.playlists.items;
      }
      if (results.tracks) {
        tracks = results.tracks.items;
        const stateTracks = getState().explorer.byId[explorerId].tracks;
        if (offset !== "0") {
          tracks.map((track: any) => stateTracks.push(track));
          tracks = stateTracks;
        }
      }
      if (results.albums) {
        albums = results.albums.items;
        const stateAlbums = getState().explorer.byId[explorerId].albums;
        if (offset !== "0") {
          albums.map((album: any) => stateAlbums.push(album));
          albums = stateAlbums;
        }
      }
      dispatch({
        type: SET_ITEMS,
        id: explorerId,
        artists,
        albums,
        tracks,
        playlists
      });
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
    let currentId;
    let title;

    switch (actionType) {
      case ACTION_TYPE.ARTIST: {
        if (!uri) return;
        files = await getAlbumsFromArtist(uri);
        currentId = (await getArtistData(uri)).name;
        title = currentId;
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
        currentId = albumData;
        title = `${albumData.artists[0].name} - ${albumData.name}`;
        break;
      }
      case ACTION_TYPE.TOP: {
        files = await getTopArtistsFromMe();
        currentId = "top";
        title = "My Top Artists";
        break;
      }
      case ACTION_TYPE.FOLLOWING: {
        files = await getFollowedArtistsFromMe();
        currentId = "following";
        title = "Following";
        break;
      }
      case ACTION_TYPE.RECENTLY_PLAYED: {
        const recentlyPlayed = await getMyRecentlyPlayed();
        files = recentlyPlayed.map(derivedTrack => derivedTrack.track);
        currentId = "recently";
        title = "Recently Played";
        break;
      }
      case ACTION_TYPE.LIBRARY_TRACKS: {
        const items = await getMyLibraryTracks();
        files = items.map(item => item.track);
        currentId = "savedtracks";
        title = "My Saved Tracks";
        break;
      }
      case ACTION_TYPE.LIBRARY_ALBUMS: {
        const items = await getMyLibraryAlbums();
        files = items.map(item => item.album);
        currentId = "savedalbums";
        title = "My Saved Albums";
        break;
      }
    }

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId,
        title
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

export function selectFile(fileId: number, explorerId: string) {
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
