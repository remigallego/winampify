import { STATUS } from ".";
import { formatMillisecondsToMmSs } from "../utils/time";

export const isBeginningOfTrack = (state: Spotify.PlaybackState) =>
  state.position !== 0 && state.position < 10 && !state.paused;

export const isPauseTrack = (state: Spotify.PlaybackState, status: STATUS) =>
  status !== STATUS.PAUSED && state.position && state.paused;

export const isResumeTrack = (
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

export const isSeekTrack = (
  state: Spotify.PlaybackState,
  previousPosition: number,
  previousStatus: STATUS
) => {
  return previousStatus === STATUS.PLAYING && state.position && !state.paused;
};

export const isEndOfTrack = (state: Spotify.PlaybackState) =>
  state.paused &&
  state.position === 0 &&
  state.restrictions.disallow_resuming_reasons &&
  state.restrictions.disallow_resuming_reasons[0] === "not_paused";

export const getArtistName = (state: Spotify.PlaybackState): string =>
  state.track_window.current_track.artists[0].name;
export const getTrackName = (state: Spotify.PlaybackState): string =>
  state.track_window.current_track.name;
export const getTrackDuration = (state: Spotify.PlaybackState): string =>
  formatMillisecondsToMmSs(state.duration);
export const getTrackCurrentPosition = (state: Spotify.PlaybackState): string =>
  formatMillisecondsToMmSs(state.position);
