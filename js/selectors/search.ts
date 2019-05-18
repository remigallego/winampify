import { AppState } from "../reducers";
import { getActiveExplorerId } from "../utils/explorer";

export const selectSearch = (state: AppState, props: any) => {
  const id = props.explorer.id;
  return state.searchPagination[id];
};

export const selectFilter = (state: AppState) => {
  const id = getActiveExplorerId(state);
  if (state.searchPagination[id]) return state.searchPagination[id].filter;
};
