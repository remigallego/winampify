import { TrackFile } from "../types";
import { Dispatch } from "react";
import { Action } from "redux";
import { PLAY } from "../reducers/playback";
import WebampControls from "../SpotifyMediaClass/controls";

export function playTrack(file: TrackFile): any {
  return (dispatch: Dispatch<Action>) => {
    WebampControls.clearPlaylistAndLoadFile(file.id);
    dispatch({
      type: PLAY
    });
  };
}
