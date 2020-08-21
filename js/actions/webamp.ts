import { Action, Dispatch } from "redux";
import Webamp, * as WebampInstance from "webamp";
import { AppState } from "../reducers";
import { PLAY, SET_WEBAMP } from "../reducers/webamp";
import { CLOSE_WEBAMP, OPEN_WEBAMP } from "../reducers/windows";
import SpotifyMedia from "../spotifymedia";
import { TrackFile } from "../types";
import { formatMetaToWebampMeta } from "../utils/dataTransfer";

export function setOfflineWebamp(): any {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const WebampConstructor: any = WebampInstance;
    const webampObject: Webamp = new WebampConstructor(
      {
        __initialWindowLayout: {
          main: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150)
            }
          },
          playlist: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150 + 116)
            }
          }
        },
        handleTrackDropEvent: () => {
          const { tracks } = getState().dataTransfer;
          if (tracks?.length > 0) {
            try {
              return tracks;
            } catch (err) {
              // tslint:disable-next-line: no-console
              console.error(err);
            }
          }
          return null;
        }
        /*  __customMediaClass: SpotifyMedia */
      },
      {}
    );

    dispatch({ type: SET_WEBAMP, payload: { webampObject } });
  };
}

export function setConnectedWebamp(): any {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const WebampConstructor: any = WebampInstance;
    const webampObject: Webamp = new WebampConstructor(
      {
        __initialWindowLayout: {
          main: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150)
            }
          },
          playlist: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150 + 116)
            }
          }
        },
        handleTrackDropEvent: () => {
          const { tracks } = getState().dataTransfer;
          if (tracks?.length > 0) {
            try {
              return tracks;
            } catch (err) {
              // tslint:disable-next-line: no-console
              console.error(err);
            }
          }
          return null;
        },
        __customMediaClass: SpotifyMedia
      },
      {}
    );

    dispatch({ type: SET_WEBAMP, payload: { webampObject } });
  };
}

export function openWebamp() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const { webampObject } = getState().webamp;
    webampObject.renderWhenReady(document.getElementById("webamp-container"));
    dispatch({
      type: OPEN_WEBAMP
    });
  };
}

export function removeWebamp() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const { webampObject } = getState().webamp;
    webampObject.dispose();
  };
}

export function closeWebamp() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    dispatch({
      type: CLOSE_WEBAMP
    });
  };
}

export function appendTracks(file: TrackFile[]) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const { webampObject } = getState().webamp;
    const webampMetadata = file.map(f => formatMetaToWebampMeta(f.metaData));
    webampObject.appendTracks(webampMetadata);
  };
}

export function setTracksToPlay(file: TrackFile[]) {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const { webampObject } = getState().webamp;
    const webampMetadata = file.map(f => formatMetaToWebampMeta(f.metaData));
    webampObject.setTracksToPlay(webampMetadata);
    dispatch({
      type: PLAY
    });
  };
}
