import { Dispatch } from "react";
import { Action } from "redux";
import { PLAY } from "../reducers/playback";
import WebampControls from "../spotifymedia/controls";
import { TrackFile } from "../types";
import { formatMetaToWebampMeta } from "../utils/dataTransfer";
import { setWebampDataTransfer } from "./dataTransfer";

export function playTrack(file: TrackFile): any {
  return (dispatch: Dispatch<Action>) => {
    dispatch(setWebampDataTransfer([formatMetaToWebampMeta(file.metaData)]));
    setTimeout(() => WebampControls.mockWindowDrop(), 0);
    dispatch({
      type: PLAY
    });
  };
}
