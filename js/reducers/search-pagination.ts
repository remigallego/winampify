import { SearchPaginationActionTypes } from "../actions/search-pagination";
import { APPLY_SNAPSHOT } from "./index";

export interface QueryState {
  query: string;
  filter: {
    types: string[];
    // TODO: To be extended
  };
  album: {
    loading: boolean;
    current: number;
    total: number;
  };
  artist: {
    loading: boolean;
    current: number;
    total: number;
  };
  track: {
    loading: boolean;
    current: number;
    total: number;
  };
}

export interface SearchPaginationState {
  [explorerId: string]: QueryState;
}

export const initialStateSearchPagination = {};

export const SET_SEARCH = "SET_SEARCH";
export const UPDATE_PAGINATION = "UPDATE_PAGINATION";
export const LOADING_PAGINATION = "LOADING_PAGINATION";
export const UPDATE_FILTER = "UPDATE_FILTER";

const searchPagination = (
  state: SearchPaginationState = initialStateSearchPagination,
  action: any
) => {
  switch (action.type) {
    case LOADING_PAGINATION: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          [action.payload.type]: {
            ...state[action.payload.id][action.payload.type],
            loading: true
          }
        }
      };
    }
    case UPDATE_PAGINATION:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          [action.payload.type]: {
            ...state[action.payload.id][action.payload.type],
            current: action.payload.current,
            loading: false
          }
        }
      };
    case SET_SEARCH:
      const { query, types, album, artist, track } = action.payload;
      return {
        ...state,
        [action.payload.id]: {
          query,
          filter: {
            types
          },
          album: {
            ...album,
            loading: false
          },
          artist: {
            ...artist,
            loading: false
          },
          track: {
            ...track,
            loading: false
          }
        }
      };
    case UPDATE_FILTER:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          filter: {
            ...action.payload.filter
          }
        }
      };
    default:
      return state;
  }
};

export default searchPagination;
