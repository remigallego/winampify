import * as qs from "qs";
import {
  IS_STOPPED,
  PAUSE,
  PLAY,
  SEEK_TO_PERCENT_COMPLETE,
  SET_BAND_VALUE,
  SET_BALANCE,
  SET_MEDIA,
  SET_VOLUME,
  STOP,
  UPDATE_TIME_ELAPSED,
  SET_EQ_OFF,
  SET_EQ_ON,
  PLAY_TRACK,
  BUFFER_TRACK,
  S_UPDATE_PLAYER_OBJECT
} from "./actionTypes";

import eventListener from "./spotifyEvents";

import { next as nextTrack } from "./actionCreators";

export default media => store => {
  eventListener.on("player_state_changed", data => {
    store.dispatch({
      type: SET_MEDIA,
      kbps: data.bitrate / 1000,
      khz: "44.1",
      length: data.duration / 1000 || null,
      elapsed: data.position / 1000 || null,
      channels: 2,
      volume: data.volume * 100
    });
  });

  // Oops. Very dirty... This needs to be changed but for now this does the job I guess.
  eventListener.on("unfocus", () => {
    setTimeout(() => {
      store.dispatch({
        type: "UNSET_FOCUS"
      });
    }, 2000);
  });

  eventListener.on("token_expired", refreshToken => {
    console.log("=== Token has been refreshed");
    fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: qs.stringify({
        // eslint-disable-next-line
        grant_type: "refresh_token",
        // eslint-disable-next-line
        refresh_token: refreshToken
      })
    }).then(res => {
      console.log(res);
    });
  });

  eventListener.on("ended", () => {
    store.dispatch({ type: IS_STOPPED });
    store.dispatch(nextTrack());
  });

  setInterval(() => {
    media.timeElapsed(elapsed => {
      if (!isNaN(elapsed))
        store.dispatch({
          type: UPDATE_TIME_ELAPSED,
          elapsed: elapsed / 1000
        });
    });
  }, 1000);

  return next => action => {
    // TODO: Consider doing this after the action, and using the state as the source of truth.
    switch (action.type) {
      case PLAY:
        media.play();
        break;
      case PAUSE:
        media.pause();
        break;
      case STOP:
        media.stop();
        break;
      case S_UPDATE_PLAYER_OBJECT:
        media.setPlayer(action.player);
        break;
      case SET_VOLUME:
        media.setVolume(action.volume);
        break;
      case SET_BALANCE:
        media.setBalance(action.balance);
        break;
      case SEEK_TO_PERCENT_COMPLETE:
        media.seekToPercentComplete(action.percent);
        break;
      case PLAY_TRACK:
        media.playURI(store.getState().playlist.tracks[action.id].URI);
        break;
      case BUFFER_TRACK:
        media.loadFromUrl(
          store.getState().playlist.tracks[action.id].url,
          action.name,
          false
        );
        break;
      case SET_BAND_VALUE:
        if (action.band === "preamp") {
          media.setPreamp(action.value);
        } else {
          media.setEqBand(action.band, action.value);
        }
        break;
      case SET_EQ_OFF:
        media.disableEq();
        break;
      case SET_EQ_ON:
        media.enableEq();
        break;
      default:
        break;
    }
    return next(action);
  };
};
