import { Dispatch } from "react";
import { Action } from "redux";
import { PLAY } from "../reducers/playback";
import WebampControls from "../spotifymedia/controls";
import { TrackFile } from "../types";

export function playTrack(file: TrackFile): any {
  return (dispatch: Dispatch<Action>) => {
    WebampControls.clearPlaylistAndLoadFile(file.id);
    dispatch({
      type: PLAY
    });
  };
}
