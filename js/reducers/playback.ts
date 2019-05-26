import { STATUS } from "../spotifymedia";

export interface PlaybackState {
  status: STATUS;
}

export const initialStatePlayback: PlaybackState = {
  status: STATUS.STOPPED
};

export const PLAY = "PLAY";

const playback = (state: PlaybackState = initialStatePlayback, action: any) => {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        status: STATUS.PLAYING
      };
    default:
      return state;
  }
};

export default playback;
