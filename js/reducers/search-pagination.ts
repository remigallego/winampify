import { SearchPaginationActionTypes } from "../actions/search-pagination";

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

const initialState = {};

export const SET_SEARCH = "SET_SEARCH";
export const UPDATE_PAGINATION = "UPDATE_PAGINATION";
export const LOADING_PAGINATION = "LOADING_PAGINATION";
const searchPagination = (
  state: SearchPaginationState = initialState,
  action: SearchPaginationActionTypes
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
    default:
      return state;
  }
};

export default searchPagination;