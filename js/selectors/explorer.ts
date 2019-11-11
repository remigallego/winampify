import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const selectImages = createSelector(
  (state: AppState) => state.images.allIds,
  (state: AppState) => state.images.byId,
  (allIds, byId) => {
    return allIds.map(id => byId[id]);
  }
);

export const selectExplorers = createSelector(
  (state: AppState) => state.explorer.allIds,
  (state: AppState) => state.explorer.byId,
  (allIds, byId) => {
    return allIds.map(id => byId[id]);
  }
);
