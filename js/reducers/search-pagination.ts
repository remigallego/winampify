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

const setSearch = (state: SearchPaginationState, payload: any) => {
  const query = payload.query;
  const newState = state;
  newState[payload.id] = {
    query,
    filter: {
      types: payload.types
    },
    album: {
      ...payload.album,
      loading: false
    },
    artist: {
      ...payload.artist,
      loading: false
    },
    track: {
      ...payload.track,
      loading: false
    }
  };
  return newState;
};

const updatePagination = (state: SearchPaginationState, payload: any) => {
  const { id, current } = payload;
  const type: "artist" | "album" | "track" = payload.type;
  return {
    ...state,
    [id]: {
      ...state[id],
      [type]: {
        ...state[id][type],
        current,
        loading: false
      }
    }
  };
};

const loadingPagination = (state: SearchPaginationState, payload: any) => {
  const { id } = payload;
  const type: "artist" | "album" | "track" = payload.type;
  return {
    ...state,
    [id]: {
      ...state[id],
      [payload.type]: {
        ...state[id][type],
        loading: true
      }
    }
  };
};

export const SET_SEARCH = "SET_SEARCH";
export const UPDATE_PAGINATION = "UPDATE_PAGINATION";
export const LOADING_PAGINATION = "LOADING_PAGINATION";

const searchPagination = (state: SearchPaginationState = initialState, action: any) => {
  switch (action.type) {
    case LOADING_PAGINATION:
      return loadingPagination(state, action.payload);
    case UPDATE_PAGINATION:
      return updatePagination(state, action.payload);
    case SET_SEARCH:
      return setSearch(state, action.payload);
    default:
      return state;
  }
};

export default searchPagination;
