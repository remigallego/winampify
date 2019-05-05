import { getUserInfos } from "../api/apiFunctions";
import { Dispatch, Action } from "redux";
import {
  SET_TOKENS,
  SET_USER_INFOS,
  LOG_OUT,
  WIPE_TOKENS,
  INVALID_TOKENS,
  LOG_IN,
  AUTHENTICATION,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE
} from "../reducers/user";
import Api from "../api";
import { initPlayer } from "../spotifymedia/initPlayer";

export const authenticate = (accessToken: string, refreshToken: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: AUTHENTICATION
    });

    Api.authenticate(accessToken)
      .then(() => initPlayer(accessToken))
      .then(() => {
        // Useless timeout I know, the loading animation just looks like nice ;P
        setTimeout(() => {
          dispatch({
            type: AUTHENTICATION_SUCCESS,
            payload: {
              accessToken,
              refreshToken
            }
          });
        }, 1000);
      })
      .catch(e => {
        if (e && e.message && e.message === "Invalid access token") {
          dispatch({
            type: AUTHENTICATION_FAILURE
          });
        }
      });
  };
};

export function setUserInfos() {
  return async (dispatch: Dispatch<Action>) => {
    const infos = await getUserInfos();
    dispatch({
      type: SET_USER_INFOS,
      payload: {
        name: infos.display_name,
        image: infos.images[0].url,
        uri: infos.uri
      }
    });
  };
}

export function logOut() {
  return (dispatch: Dispatch<Action>) => {
    const webamp: HTMLElement | null = document.getElementById("webamp");
    if (webamp) webamp.remove();

    dispatch({
      type: LOG_OUT
    });
  };
}

export const wipeTokens = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: WIPE_TOKENS
    });
  };
};
