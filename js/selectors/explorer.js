import { createSelector } from "reselect";

export const getAlbumCovers = createSelector(
  state => state.explorer.albumCovers,
  albumCovers => albumCovers
);

export const getExplorers = createSelector(
  state => state.explorer.allIds,
  allIds => allIds
);
