import { AppState } from "../reducers";
import { getActiveExplorerId } from "../utils/explorer";

export const selectSearch = (state: AppState, props: any) => {
  let explorerId = "";
  if (props && props.id) {
    explorerId = props.id;
  } else explorerId = getActiveExplorerId(state);
  if (explorerId) return state.searchPagination[explorerId];
  else return undefined;
};

export const selectFilter = (state: AppState) => {
  const id = getActiveExplorerId(state);
  if (state.searchPagination[id]) return state.searchPagination[id].filter;
};
