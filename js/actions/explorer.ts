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
  getAlbumInfos,
  getTopArtistsFromMe,
  getFollowedArtistsFromMe,
  getMyRecentlyPlayed,
  getMyLibraryAlbums,
  getMyLibraryTracks,
  getArtistData
} from "../SpotifyApiFunctions";
import { generateExplorerId } from "../utils/explorer";
import { OPEN_EXPLORER } from "../reducers/explorer";
import { Dispatch, Action } from "redux";
import { AppState } from "../reducers";

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
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({
      type: SET_EXPLORER_METADATA,
      id: explorerId,
      currentId: "search",
      title: search,
      image: null,
      playlistable: false
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
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });

    const albums = await getAlbumsFromArtist(artist);
    const artistName = await getArtistData(artist);

    dispatch({
      type: SET_ITEMS,
      id: explorerId,
      tracks: null,
      albums: albums,
      playlists: null,
      artists: null
    });
    dispatch({
      type: SET_EXPLORER_METADATA,
      id: explorerId,
      currentId: artistName,
      title: name,
      playlistable: false
    });
  };
}

export function viewTracksFromAlbum(album: string, explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getTracksFromAlbum(album)
      .then(tracks => tracks)
      .then(tracks =>
        getAlbumInfos(album).then((albumInfos: any) => {
          const title = `${albumInfos.artists[0].name} - ${albumInfos.name}`;
          const image = albumInfos.images[0].url;
          dispatch({
            type: SET_EXPLORER_METADATA,
            id: explorerId,
            currentId: albumInfos,
            title: title,
            image: image,
            playlistable: true
          });
          dispatch({
            type: SET_ITEMS,
            id: explorerId,
            tracks: tracks,
            albums: null,
            playlists: null,
            artists: null
          });
        })
      );
  };
}

export function viewMyTopArtists(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getTopArtistsFromMe().then(artists => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        id: explorerId,
        currentId: "top",
        title: "My Top Artists",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        id: explorerId,
        tracks: null,
        albums: null,
        playlists: null,
        artists: artists
      });
    });
  };
}

export function viewMyFollowedArtists(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getFollowedArtistsFromMe().then(artists => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        id: explorerId,
        currentId: "following",
        title: "Following",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        id: explorerId,
        albums: null,
        playlists: null,
        artists: artists
      });
    });
  };
}

export const viewMyRecentlyPlayed = (explorerId: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    const recentlyPlayed = await getMyRecentlyPlayed();
    const tracks = recentlyPlayed.map(derivedTrack => derivedTrack.track);
    dispatch({
      type: SET_EXPLORER_METADATA,
      id: explorerId,
      currentId: "recently",
      title: "Recently Played",
      image: null,
      playlistable: false // TODO: Is it actually useful?
    });
    dispatch({
      type: SET_ITEMS,
      tracks: tracks,
      id: explorerId,
      albums: null,
      playlists: null,
      artists: null
    });
  };
};

export function viewMyLibraryAlbums(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getMyLibraryAlbums().then(albums => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        id: explorerId,
        currentId: "savedalbums",
        title: "My Saved Albums",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        id: explorerId,
        tracks: null,
        albums: albums.map((obj: any) => obj.album),
        playlists: null,
        artists: null
      });
    });
  };
}

export function viewMyLibraryTracks(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getMyLibraryTracks().then(tracks => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        id: explorerId,
        currentId: "savedtracks",
        title: "My Saved Tracks",
        image: null,
        playlistable: false // TODO: investigate
      });
      dispatch({
        type: SET_ITEMS,
        id: explorerId,
        tracks: tracks.map((obj: any) => obj.track),
        albums: null,
        playlists: null,
        artists: null
      });
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
      id: explorerId,
      selected: fileId
    });
  };
}
