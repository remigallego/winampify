import { GO_PREVIOUS_STATE } from "./actionTypes";
import { Action, Dispatch } from "redux";

// TODO: Move somewhere else
export function goPreviousState(explorerId: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: GO_PREVIOUS_STATE, payload: { id: explorerId } });
  };
}
