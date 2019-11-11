import { Dispatch } from "react";
import { Action } from "redux";
import { PLAY } from "../reducers/playback";
import { TrackFile } from "../types";
import { setDataTransferArray } from "./dataTransfer";
import { formatMetaToWebampMeta } from "../utils/dataTransfer";

export function playTrack(file: TrackFile): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch(setDataTransferArray([formatMetaToWebampMeta(file.metaData)]));

    // @TODO: Find a way to trigger Webamp play
    dispatch({
      type: PLAY
    });
  };
}
