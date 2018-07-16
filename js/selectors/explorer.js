import { createSelector } from "reselect";

export const getAlbumCovers = createSelector(
  state => state.explorer.albumCovers,
  albumCovers => albumCovers
);
