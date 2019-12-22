import { Action, Dispatch } from "redux";
import Webamp, * as WebampInstance from "webamp";
import { AppState } from "../reducers";
import { SET_WEBAMP } from "../reducers/webamp";
import SpotifyMedia from "../spotifymedia";

export function setWebampInstance(): any {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const WebampConstructor: any = WebampInstance;
    const newWebamp: Webamp = new WebampConstructor(
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
          const dataTransferArray = getState().dataTransfer.data;
          if (dataTransferArray?.length > 0) {
            try {
              return dataTransferArray;
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

    dispatch({ type: SET_WEBAMP, payload: { webamp: newWebamp } });
  };
}

export function openWebamp() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const { instance } = getState().webamp;
    instance.renderWhenReady(document.getElementById("webamp"));
  };
}
