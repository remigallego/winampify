import { Dispatch } from "react";
import { Action } from "redux";
import { PLAY } from "../reducers/playback";
import { TrackFile } from "../types";
import { setWebampDataTransfer } from "./dataTransfer";
import { formatMetaToWebampMeta } from "../utils/dataTransfer";
import WebampControls from "../spotifymedia/controls";

export function playTrack(file: TrackFile): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch(setWebampDataTransfer([formatMetaToWebampMeta(file.metaData)]));
    setTimeout(() => WebampControls.mockWindowDrop(), 0);
    dispatch({
      type: PLAY
    });
  };
}
