import uuidv1 from "uuid/v1";
import {
  REMOVE_ALL_TRACKS,
  UNSET_FOCUS_EXPLORER,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  LOADING,
  SET_ITEMS,
  ADD_IMAGE,
  CLOSE_IMAGE
} from "../actionTypes";
import { addTrackZeroAndPlay, addTracksFromAlbum } from "../actionCreators";
import {
  getSearchResult,
  getAlbumsFromArtist,
  getArtistName,
  getTracksFromAlbum,
  getAlbumInfos,
  getTopArtistsFromMe,
  getFollowedArtistsFromMe,
  getMyRecentlyPlayed,
  getMyLibraryAlbums,
  getMyLibraryTracks,
  getArtistInfos
} from "../SpotifyApiFunctions";

export function createNewExplorer() {
  return dispatch => {
    dispatch({
      type: "CREATE_NEW_EXPLORER"
    });
  };
}

export function closeExplorer(explorerId) {
  return dispatch => {
    dispatch({
      type: "CLOSE_EXPLORER",
      id: explorerId
    });
  };
}

export function updatePosition(x, y, explorerId) {
  return dispatch => {
    dispatch({
      type: "UPDATE_POSITION",
      id: explorerId,
      x,
      y
    });
  };
}

export function updateSize(width, height, explorerId) {
  return dispatch => {
    dispatch({
      type: "UPDATE_SIZE",
      id: explorerId,
      width,
      height
    });
  };
}

export function setOnTop(explorerId) {
  return dispatch => {
    dispatch({
      type: "SET_ON_TOP",
      id: explorerId
    });
  };
}

export function unsetFocusExplorer(explorerId) {
  return dispatch => {
    dispatch({
      type: UNSET_FOCUS_EXPLORER,
      id: explorerId
    });
  };
}

export function playTrackFromExplorer(trackId, explorerId) {
  return dispatch => {
    dispatch({ type: REMOVE_ALL_TRACKS, id: explorerId });
    dispatch(addTrackZeroAndPlay(trackId));
  };
}

export function searchOnSpotify(search, type, offset, explorerId) {
  return (dispatch, getState) => {
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
          artists.map(artist => stateArtists.push(artist));
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
          tracks.map(track => stateTracks.push(track));
          tracks = stateTracks;
        }
      }
      if (results.albums) {
        albums = results.albums.items;
        const stateAlbums = getState().explorer.byId[explorerId].albums;
        if (offset !== "0") {
          albums.map(album => stateAlbums.push(album));
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

export function playAlbumFromExplorer(album, explorerId) {
  return dispatch => {
    dispatch({ type: REMOVE_ALL_TRACKS, id: explorerId });
    dispatch(addTracksFromAlbum(album.id));
  };
}

export function viewAlbumsFromArtist(artist, explorerId) {
  return (dispatch, getState) => {
    if (explorerId === undefined) {
      dispatch(createNewExplorer());
      explorerId = getState().explorer.allIds.length - 1;
    }
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getAlbumsFromArtist(artist).then(albums => {
      dispatch({
        type: SET_ITEMS,
        id: explorerId,
        tracks: null,
        albums: albums,
        playlists: null,
        artists: null
      });
      getArtistName(artist).then(name => {
        dispatch({
          type: SET_EXPLORER_METADATA,
          id: explorerId,
          currentId: artist,
          title: name,
          playlistable: false
        });
      });
    });
  };
}

export function viewTracksFromAlbum(album, explorerId) {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getTracksFromAlbum(album)
      .then(tracks => tracks)
      .then(tracks =>
        getAlbumInfos(album).then(albumInfos => {
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

export function viewMyTopArtists(explorerId) {
  return dispatch => {
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

export function viewMyFollowedArtists(explorerId) {
  return dispatch => {
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

export function viewMyRecentlyPlayed(explorerId) {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE, id: explorerId });
    dispatch({ type: LOADING, id: explorerId });
    getMyRecentlyPlayed().then(tracks => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        id: explorerId,
        currentId: "recently",
        title: "Recently Played",
        image: null,
        playlistable: false // TODO: Is it actually?
      });
      dispatch({
        type: SET_ITEMS,
        tracks: tracks,
        id: explorerId,
        albums: null,
        playlists: null,
        artists: null
      });
    });
  };
}

export function viewMyLibraryAlbums(explorerId) {
  return dispatch => {
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
        albums: albums.map(obj => obj.album),
        playlists: null,
        artists: null
      });
    });
  };
}

export function viewMyLibraryTracks(explorerId) {
  return dispatch => {
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
        tracks: tracks.map(obj => obj.track),
        albums: null,
        playlists: null,
        artists: null
      });
    });
  };
}

export function getArtistFromId(id) {
  return () => {
    getArtistInfos(id).then(result => result);
  };
}

export function selectFile(fileId, explorerId) {
  return dispatch => {
    dispatch({
      type: "SET_SELECTED_EXPLORER",
      id: explorerId,
      selected: fileId
    });
  };
}

export function addImage(source, x, y) {
  return dispatch => {
    dispatch({
      type: ADD_IMAGE,
      id: uuidv1(),
      source,
      x,
      y
    });
  };
}

export function closeImage(id) {
  return dispatch => {
    dispatch({
      type: CLOSE_IMAGE,
      id
    });
  };
}
