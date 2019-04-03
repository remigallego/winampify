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
import { File } from "../types";
import { ArtistData } from "../SpotifyApi/types";

export function createNewExplorer() {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: OPEN_EXPLORER,
      id: generateExplorerId()
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

export function viewAlbumsFromArtist(artist: string, explorerId: number) {
  return async (dispatch: Dispatch<Action>, getState: () => AppState) => {
    if (explorerId === undefined) {
      createNewExplorer();
      explorerId = getState().explorer.allIds.length - 1;
    }
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const albums = await getAlbumsFromArtist(artist);
    const artistName = await getArtistData(artist);

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: artistName,
        title: name
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: albums
      }
    });
  };
}

export function setTracksFromAlbum(album: string, explorerId: string) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const tracks = await getTracksFromAlbum(album);
    const albumData = await getAlbumData(album);
    const title = `${albumData.artists[0].name} - ${albumData.name}`;
    const image = albumData.images[0].url;

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: albumData,
        title: title,
        image: image
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: { id: explorerId, files: tracks }
    });
  };
}

export function setMyTopArtists(explorerId: string) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const artists = await getTopArtistsFromMe();

    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "top",
        title: "My Top Artists",
        image: null
      }
    });

    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: artists
      }
    });
  };
}

export function setMyFollowedArtists(explorerId: string) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });

    const artists = await getFollowedArtistsFromMe();
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "following",
        title: "Following",
        image: null
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: artists
      }
    });
  };
}

export const viewMyRecentlyPlayed = (explorerId: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });
    const recentlyPlayed = await getMyRecentlyPlayed();
    const tracks = recentlyPlayed.map(derivedTrack => derivedTrack.track);
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "recently",
        title: "Recently Played",
        image: null
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: {
        files: tracks,
        id: explorerId
      }
    });
  };
};

export function viewMyLibraryAlbums(explorerId: string) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });
    const items = await getMyLibraryAlbums();
    const albums = items.map(item => item.album);
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "savedalbums",
        title: "My Saved Albums",
        image: null
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: albums
      }
    });
  };
}

export function viewMyLibraryTracks(explorerId: string) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, payload: { id: explorerId } });
    dispatch({ type: LOADING, id: explorerId });
    const items = await getMyLibraryTracks();
    const tracks = items.map(item => item.track);
    dispatch({
      type: SET_EXPLORER_METADATA,
      payload: {
        id: explorerId,
        currentId: "savedtracks",
        title: "My Saved Tracks",
        image: null
      }
    });
    dispatch({
      type: SET_ITEMS,
      payload: {
        id: explorerId,
        files: tracks
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
