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

export function unsetFocusExplorer() {
  return dispatch => {
    dispatch({
      type: UNSET_FOCUS_EXPLORER
    });
  };
}

export function playTrackFromExplorer(trackId) {
  return dispatch => {
    dispatch({ type: REMOVE_ALL_TRACKS });
    dispatch(addTrackZeroAndPlay(trackId));
  };
}

export function searchOnSpotify(search, type, offset) {
  return (dispatch, getState) => {
    dispatch({ type: "SEARCH" });
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({
      type: SET_EXPLORER_METADATA,
      currentId: "search",
      title: search,
      image: null,
      playlistable: false
    });
    if (offset === "0") dispatch({ type: LOADING });
    getSearchResult(search, type, offset).then(results => {
      let albums = getState().explorer.albums;
      let artists = getState().explorer.artists;
      let playlists = getState().explorer.playlists;
      let tracks = getState().explorer.tracks;
      if (results.artists) {
        artists = results.artists.items;
        const stateArtists = getState().explorer.artists;
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
        const stateTracks = getState().explorer.tracks;
        if (offset !== "0") {
          tracks.map(track => stateTracks.push(track));
          tracks = stateTracks;
        }
      }
      if (results.albums) {
        albums = results.albums.items;
        const stateAlbums = getState().explorer.albums;
        if (offset !== "0") {
          albums.map(album => stateAlbums.push(album));
          albums = stateAlbums;
        }
      }
      dispatch({
        type: SET_ITEMS,
        artists,
        albums,
        tracks,
        playlists
      });
    });
  };
}

export function playAlbumFromExplorer(album) {
  return dispatch => {
    dispatch({ type: REMOVE_ALL_TRACKS });
    dispatch(addTracksFromAlbum(album.id));
  };
}
export function viewAlbumsFromArtist(artist) {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getAlbumsFromArtist(artist).then(albums => {
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        albums: albums,
        playlists: null,
        artists: null
      });
      getArtistName(artist).then(name => {
        dispatch({
          type: SET_EXPLORER_METADATA,
          currentId: artist,
          title: name,
          playlistable: false
        });
      });
    });
  };
}

export function viewTracksFromAlbum(album) {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getTracksFromAlbum(album)
      .then(tracks => tracks)
      .then(tracks =>
        getAlbumInfos(album).then(albumInfos => {
          const title = `${albumInfos.artists[0].name} - ${albumInfos.name}`;
          const image = albumInfos.images[0].url;
          dispatch({
            type: SET_EXPLORER_METADATA,
            currentId: albumInfos,
            title: title,
            image: image,
            playlistable: true
          });
          dispatch({
            type: SET_ITEMS,
            tracks: tracks,
            albums: null,
            playlists: null,
            artists: null
          });
        })
      );
  };
}

export function viewMyTopArtists() {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getTopArtistsFromMe().then(artists => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        currentId: "top",
        title: "My Top Artists",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        albums: null,
        playlists: null,
        artists: artists
      });
    });
  };
}

export function viewMyFollowedArtists() {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getFollowedArtistsFromMe().then(artists => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        currentId: "following",
        title: "Following",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        albums: null,
        playlists: null,
        artists: artists
      });
    });
  };
}

export function viewMyRecentlyPlayed() {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getMyRecentlyPlayed().then(tracks => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        currentId: "recently",
        title: "Recently Played",
        image: null,
        playlistable: false // TODO: Is it actually?
      });
      dispatch({
        type: SET_ITEMS,
        tracks: tracks,
        albums: null,
        playlists: null,
        artists: null
      });
    });
  };
}

export function viewMyLibraryAlbums() {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getMyLibraryAlbums().then(albums => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        currentId: "savedalbums",
        title: "My Saved Albums",
        image: null,
        playlistable: false
      });
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        albums: albums.map(obj => obj.album),
        playlists: null,
        artists: null
      });
    });
  };
}

export function viewMyLibraryTracks() {
  return dispatch => {
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    getMyLibraryTracks().then(tracks => {
      dispatch({
        type: SET_EXPLORER_METADATA,
        currentId: "savedtracks",
        title: "My Saved Tracks",
        image: null,
        playlistable: false // TODO: investigate
      });
      dispatch({
        type: SET_ITEMS,
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
