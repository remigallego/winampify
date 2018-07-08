import {
  REMOVE_ALL_TRACKS,
  UNSET_FOCUS_EXPLORER,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  LOADING,
  SET_ITEMS
} from "../actionTypes";
import { addTrackZeroAndPlay, addTracksFromAlbum } from "../actionCreators";
import {
  parseSearchSpotify,
  parseAlbumsFromArtist,
  getArtistName,
  parseTracksFromAlbum,
  getAlbumInfos,
  parseTopArtistsFromMe,
  parseFollowedArtistsFromMe,
  parseMyRecentlyPlayed,
  parseMyLibraryAlbums,
  parseMyLibraryTracks,
  parseArtist
} from "../spotifyParser";

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
    const state = getState();
    const token = state.media.player.accessToken;
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
    parseSearchSpotify(token, search, type, offset, (err, results) => {
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseAlbumsFromArtist(token, artist, (err, albums) => {
      dispatch({
        type: SET_ITEMS,
        tracks: null,
        albums: albums,
        playlists: null,
        artists: null
      });
      getArtistName(token, artist, name => {
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseTracksFromAlbum(token, album, (err, tracks) => {
      if (err) console.log(err);
      getAlbumInfos(token, album, (_err, _album) => {
        const title = `${_album.artists[0].name} - ${_album.name}`;
        const image = _album.images[0].url;
        dispatch({
          type: SET_EXPLORER_METADATA,
          currentId: _album,
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
      });
    });
  };
}

export function viewMyTopArtists() {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseTopArtistsFromMe(token, (err, artists) => {
      if (err) throw err;
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseFollowedArtistsFromMe(token, (err, artists) => {
      if (err) throw err;
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseMyRecentlyPlayed(token, (err, tracks) => {
      if (err) throw err;
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseMyLibraryAlbums(token, (err, albums) => {
      if (err) throw err;
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    dispatch({ type: SAVE_PREVIOUS_STATE });
    dispatch({ type: LOADING });
    parseMyLibraryTracks(token, (err, tracks) => {
      if (err) throw err;
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
  return (dispatch, getState) => {
    const state = getState();
    const token = state.media.player.accessToken;
    parseArtist(token, id, (err, result) => {
      if (err) throw err;
      return result;
    });
  };
}
