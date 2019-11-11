import { Action, Dispatch } from "redux";

export const SET_ON_TOP = "SET_ON_TOP";

export function setOnTop(windowsId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_ON_TOP,
      id: windowsId
    });
  };
}
