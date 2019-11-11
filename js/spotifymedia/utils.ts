import { STATUS } from ".";

export const beginningOfTrack = (state: Spotify.PlaybackState) =>
  !state.position && !state.paused;

export const pauseTrack = (state: Spotify.PlaybackState) =>
  state.position && state.paused;

export const resumeTrack = (
  state: Spotify.PlaybackState,
  previousPosition: number,
  previousStatus: STATUS
) => {
  return (
    previousStatus === STATUS.PAUSED &&
    state.position &&
    !state.paused &&
    state.position + 1000 >= previousPosition &&
    state.position - 1000 <= previousPosition
  );
};

export const seekTrack = (
  state: Spotify.PlaybackState,
  previousPosition: number,
  previousStatus: STATUS
) => {
  return previousStatus === STATUS.PLAYING && state.position && !state.paused;
};

export const endOfTrack = (state: Spotify.PlaybackState) =>
  state.paused &&
  state.position === 0 &&
  state.restrictions.disallow_resuming_reasons &&
  state.restrictions.disallow_resuming_reasons[0] === "not_paused";
