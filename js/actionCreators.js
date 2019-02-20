import {
  REMOVE_ALL_TRACKS,
  PLAY_TRACK,
  ADD_TRACK_FROM_URI,
  S_UPDATE_PLAYER_OBJECT,
  GO_PREVIOUS_STATE
} from "./actionTypes";

import { getTrackInfos, getTracksFromAlbum } from "./SpotifyApiFunctions";

export function goPreviousState(explorerId) {
  return dispatch => {
    dispatch({ type: GO_PREVIOUS_STATE, id: explorerId });
  };
}

/* WINAMP FUNCTIONS */
export function addTrackFromURI(URI, index) {
  return (dispatch, getState) => {
    const state = getState();
    getTrackInfos(URI).then(infos => {
      index = state.playlist.trackOrder.length + index;
      dispatch({
        type: ADD_TRACK_FROM_URI,
        defaultName: `${infos.artist} - ${infos.name}`,
        artist: infos.artist,
        title: infos.name,
        duration: infos.duration / 1000,
        URI: URI,
        id: index,
        atIndex: index
      });
    });
  };
}

export function addTrackZeroAndPlay(id) {
  return dispatch => {
    getTrackInfos(id).then(infos => {
      dispatch({ type: REMOVE_ALL_TRACKS });
      dispatch({
        type: ADD_TRACK_FROM_URI,
        defaultName: `${infos.artist} - ${infos.name}`,
        artist: infos.artist,
        title: infos.name,
        duration: infos.duration / 1000,
        URI: id,
        id: 0,
        atIndex: 0
      });
      dispatch(playTrack(0));
    });
  };
}

export function addTracksFromAlbum(album) {
  return (dispatch, getState) => {
    const state = getState();
    const playlistCount = state.playlist.trackOrder.length;

    getTracksFromAlbum(album).then(tracks => {
      tracks.map(track => {
        const index = track.track_number + playlistCount;
        dispatch({
          type: ADD_TRACK_FROM_URI,
          defaultName: `${track.artists[0].name} - ${track.name}`,
          artist: track.artists[0].name,
          title: track.name,
          duration: track.duration_ms / 1000,
          URI: track.uri,
          id: index,
          atIndex: index
        });
      });
    });
  };
}

export function playTrack(id) {
  return (dispatch, getState) => {
    const orderedId = getState().playlist.trackOrder[id];
    dispatch({ type: PLAY_TRACK, id: orderedId });
  };
}

export function createPlayerObject(p) {
  const player = p;
  const id = player._options.id;
  const getOAuthToken = player._options.getOAuthToken;
  const timeMode = "ELAPSED";
  const volume = player._options.volume * 100;
  const name = player._options.name;
  const timeElapsed = 0;
  const balance = 0;
  const channels = null;
  const shuffle = false;
  const repeat = false;
  const status = "STOPPED";
  return {
    type: S_UPDATE_PLAYER_OBJECT,
    player: player,
    id: id,
    getOAuthToken: getOAuthToken,
    timeMode: timeMode,
    volume: volume,
    name: name,
    timeElapsed: timeElapsed,
    length: length,
    balance: balance,
    channels: channels,
    shuffle: shuffle,
    repeat: repeat,
    status: status
  };
}
