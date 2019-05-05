import { Dispatch, Action } from "redux";
import {
  AUTHENTICATION,
  AUTHENTICATION_FAILURE,
  LOG_OUT,
  AUTHENTICATION_SUCCESS,
  WIPE_TOKENS,
  LOG_OUT_SUCCESS
} from "../reducers/auth";
import { initPlayer } from "../spotifymedia/initPlayer";
import Api from "../api";
import { setUserInfos } from "./user";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AppState } from "../reducers";

// Just because the loading animation is so nice :P
const FAKE_LOADING_TIME = 1600;

export const authenticate = (
  accessToken: string,
  refreshToken: string
): ThunkAction<any, AppState, any, Action> => {
  return (dispatch: ThunkDispatch<AppState, any, Action>) => {
    dispatch({
      type: AUTHENTICATION
    });

    let abort = false;
    const timeout = setTimeout(() => {
      abort = true;
    }, 10 * 1000);

    Api.authenticate(accessToken)
      .then(
        (user: any): Promise<void> => {
          if (user.product !== "premium")
            return Promise.reject({
              message:
                "<b>Oh no! You don't have a Spotify Premium account. :(</b>"
            });
          else return Promise.resolve();
        }
      )
      .then(() => {
        return initPlayer(accessToken);
      })
      .then(
        (): Promise<void> => {
          if (abort) {
            return Promise.reject({
              message:
                "<b>Oops, something went wrong! Please try again. (timeout)</b>"
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
  return (dispatch: Dispatch<Action>) => {
    const webamp: HTMLElement | null = document.getElementById("webamp");
    if (webamp) webamp.remove();

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
