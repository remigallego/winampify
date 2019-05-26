import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../reducers";
import {
  LOADING_PAGINATION,
  SET_SEARCH,
  UPDATE_FILTER,
  UPDATE_PAGINATION
} from "../reducers/search-pagination";
import { SEARCH_CATEGORY } from "../types";
import { getActiveExplorerId } from "../utils/explorer";
import { setSearchResults } from "./explorer";

export interface Filter {
  types: string[];
}

export type SearchPaginationActionTypes =
  | {
      type: typeof SET_SEARCH;
      payload: {
        id: string;
        query: string;
        types: string[];
        album: { total: number; current: number } | {};
        track: { total: number; current: number } | {};
        artist: { total: number; current: number } | {};
      };
    }
  | {
      type: typeof LOADING_PAGINATION;
      payload: { id: string; type: SEARCH_CATEGORY };
    }
  | {
      type: typeof UPDATE_PAGINATION;
      payload: {
        id: string;
        type: SEARCH_CATEGORY;
        current: number;
      };
    }
  | {
      type: typeof UPDATE_FILTER;
      payload: {
        id: string;
        filter: Filter;
      };
    };

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
