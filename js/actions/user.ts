import { getUserInfos } from "../api/apiFunctions";
import { Dispatch, Action } from "redux";
import { SET_USER_INFOS, UserState } from "../reducers/user";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AppState } from "../reducers";

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
