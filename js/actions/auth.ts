import { Action, Dispatch } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import Webamp from "webamp";
import Api from "../api";
import { AppState } from "../reducers";
import {
  AUTHENTICATION,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_SUCCESS,
  LOG_OUT,
  LOG_OUT_SUCCESS,
  WIPE_TOKENS
} from "../reducers/auth";
import { initPlayer } from "../spotifymedia/initPlayer";
import { setUserInfos } from "./user";
import { setOfflineWebamp } from "./webamp";

// Just because the loading animation is so nice :P
const FAKE_LOADING_TIME = 1600;

export const authenticate: any = (
  accessToken: string,
  refreshToken: string
): ThunkAction<void, AppState, any, Action> => {
  return (
    dispatch: ThunkDispatch<AppState, any, Action>,
    getState: () => AppState
  ) => {
    dispatch({
      type: AUTHENTICATION
    });

    let abort = false;
    const timeout = setTimeout(() => {
      abort = true;
    }, 10 * 1000);

    Api.authenticate(accessToken)
      .then(
        (result: any): Promise<string> => {
          if (result.error)
            return Promise.reject({
              message: result.error.message
            });
          if (result.product !== "premium") {
            return Promise.reject({
              message: "Oh no! You don't have a Spotify Premium account. :("
            });
          } else {
            return Promise.resolve(result.accessToken);
          }
        }
      )
      .then(validAccessToken => {
        return initPlayer(validAccessToken);
      })
      .then(
        (): Promise<void> => {
          if (abort) {
            return Promise.reject({
              message: "Oops, something went wrong! Please try again. (timeout)"
            });
          } else {
            setTimeout(() => {
              dispatch({
                type: AUTHENTICATION_SUCCESS,
                payload: {
                  accessToken,
                  refreshToken
                }
              });
              dispatch(setUserInfos());
            }, FAKE_LOADING_TIME);
            return Promise.resolve();
          }
        }
      )
      .catch((e: any) => {
        clearTimeout(timeout);
        dispatch({
          type: AUTHENTICATION_FAILURE,
          error: true,
          payload: {
            message: e.message
          }
        });
      });
  };
};

export function logOut() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    const webampObject: Webamp = getState().webamp.webampObject;
    if (webampObject) {
      webampObject.dispose();
      dispatch(setOfflineWebamp());
    }

    dispatch({
      type: LOG_OUT
    });

    setTimeout(() => {
      dispatch({
        type: LOG_OUT_SUCCESS
      });
    }, FAKE_LOADING_TIME);
  };
}

export const wipeTokens = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: WIPE_TOKENS
    });
  };
};
