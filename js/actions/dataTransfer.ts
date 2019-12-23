import { Action, Dispatch } from "redux";
import { SET_DATA_TRANSFER_TRACKS } from "../reducers/dataTransfer";
import { SimplifiedTrack } from "../types";

export function setDataTransferTracks(
  tracks: SimplifiedTrack[],
  source?: string
): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_DATA_TRANSFER_TRACKS,
      payload: { tracks: tracks, source }
    });
  };
}
