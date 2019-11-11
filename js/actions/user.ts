import { Action, Dispatch } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { getUserInfos } from "../api/apiFunctions";
import { AppState } from "../reducers";
import { SET_USER_INFOS, UserState } from "../reducers/user";

export function setUserInfos(): ThunkAction<any, AppState, any, Action> {
  return async (dispatch: ThunkDispatch<AppState, any, Action>) => {
    const userProfile: UserState = await getUserInfos();
    dispatch({
      type: SET_USER_INFOS,
      payload: {
        userProfile
      }
    });
  };
}
