import { Action, Dispatch } from "redux";
import { TOGGLE_MINIMIZE } from "../reducers/windows";

export const SET_ON_TOP = "SET_ON_TOP";

export function setOnTop(windowsId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_ON_TOP,
      id: windowsId
    });
  };
}

export function toggleMinimize(windowsId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: TOGGLE_MINIMIZE,
      id: windowsId
    });
  };
}
