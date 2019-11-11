import { createSelector } from "reselect";
import { AppState } from "../reducers";

export const selectWindows = createSelector(
  (state: AppState) => state.windows.windows,
  windows => windows
);
