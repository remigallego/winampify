import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../reducers";
import { UPDATE_FILTER } from "../reducers/search-pagination";
import { getActiveExplorerId } from "../utils/explorer";
import { setSearchResults } from "./explorer";

export interface Filter {
  types: string[];
}

export const updateFilter = (filter: Filter) => {
  return async (
    dispatch: ThunkDispatch<AppState, any, Action>,
    getState: () => AppState
  ) => {
    const id = getActiveExplorerId(getState());
    dispatch({
      type: UPDATE_FILTER,
      payload: {
        id,
        filter
      }
    });
    dispatch(setSearchResults());
  };
};
