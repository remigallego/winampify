import {
  LOADING_PAGINATION,
  SET_SEARCH,
  UPDATE_PAGINATION
} from "../reducers/search-pagination";
import { SEARCH_CATEGORY } from "../types";

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
    };
