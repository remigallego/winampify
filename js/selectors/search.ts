import { AppState } from "../reducers";
import { getActiveExplorerId } from "../utils/explorer";

export const selectSearch = (state: AppState, id: string) => {
  let explorerId: string;
  if (id) {
    explorerId = id;
  } else explorerId = getActiveExplorerId(state);
  if (explorerId) return state.searchPagination[explorerId];
  else return undefined;
};

export const selectFilter = (state: AppState) => {
  const id = getActiveExplorerId(state);
  if (state.searchPagination[id]) return state.searchPagination[id].filter;
};
