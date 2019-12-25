import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const isPlaylistOwned = (playlist: SpotifyApi.PlaylistObjectFull) =>
  createSelector(
    (state: AppState) => state.user.id,
    userId => {
      return playlist.owner.id === userId;
    }
  );

export const selectExplorers = createSelector(
  (state: AppState) => state.explorer.allIds,
  (state: AppState) => state.explorer.byId,
  (allIds, byId) => {
    return allIds.map(id => byId[id]);
  }
);
