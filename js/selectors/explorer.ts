import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const getImages = createSelector(
  (state: AppState) => state.images.allIds,
  (state: AppState) => state.images.byId,
  (allIds, byId) => {
    return allIds.map(id => byId[id]);
  }
);

export const getExplorers = createSelector(
  (state: AppState) => state.explorer.allIds,
  allIds => allIds
);
