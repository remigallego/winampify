import { getUserInfos } from "../SpotifyApi/apiFunctions";
import { Dispatch, Action } from "redux";
import { SET_TOKENS, SET_USER_INFOS } from "../reducers/user";
import { ThunkAction } from "redux-thunk";

export function setTokens(accessToken: string, refreshToken: string): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_TOKENS,
      payload: {
        accessToken,
        refreshToken
      }
    });
  };
}

export function setUserInfos() {
  return (dispatch: Dispatch<Action>) => {
    getUserInfos().then(res => {
      dispatch({
        type: SET_USER_INFOS,
        payload: {
          name: res.display_name,
          image: res.images[0].url,
          uri: res.uri
        }
      });
    });
  };
}
