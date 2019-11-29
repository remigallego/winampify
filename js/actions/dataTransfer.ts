import { Action, Dispatch } from "redux";
import { SET_DATA_TRANSFER_ARRAY } from "../reducers/dataTransfer";
import { WebampTrackFormat } from "../types";

export function setWebampDataTransfer(data: WebampTrackFormat[]): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_DATA_TRANSFER_ARRAY,
      payload: { dataTransferArray: data }
    });
  };
}
