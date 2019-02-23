import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const getAlbumCovers = createSelector(
  (state: AppState) => state.explorer.albumCovers,
  albumCovers => albumCovers
);

export const getExplorers = createSelector(
  (state: AppState) => state.explorer.allIds,
  allIds => allIds
);
