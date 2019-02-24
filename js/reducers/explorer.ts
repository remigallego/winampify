import {
  SET_SELECTED_EXPLORER,
  SET_EXPLORER_METADATA,
  UNSET_FOCUS_EXPLORER,
  SET_ITEMS,
  GO_PREVIOUS_STATE,
  SAVE_PREVIOUS_STATE,
  LOADING
} from "../actionTypes";
import { generateExplorerId } from "../utils/explorer";

export interface SingleExplorerState {
  selected: any;
  currentId: any;
  title: any;
  image: any;
  playlistable: boolean; // Is this ever useful?
  previousStates: Array<any>;
  artists: any;
  albums: any;
  tracks: any;
  playlists: any;
  loading: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ExplorerState {
  byId: {
    [id: string]: SingleExplorerState;
  };
  allIds: string[];
}

const initialStateExplorer: SingleExplorerState = {
  selected: null,
  currentId: null,
  title: null,
  image: null,
  playlistable: false, // Is this ever useful?
  previousStates: [],
  // items
  artists: null,
  albums: null,
  tracks: null,
  playlists: null,
  loading: false,
  // position
  width: 400,
  height: 500,
  x: 0,
  y: 0
};

const initialState: ExplorerState = {
  byId: {},
  allIds: []
};

export const OPEN_EXPLORER = "OPEN_EXPLORER";
export const CLOSE_EXPLORER = "CLOSE_EXPLORER";
export const UPDATE_POSITION = "UPDATE_POSITION";
export const UPDATE_SIZE = "UPDATE_SIZE";

const explorer = (state = initialState, action: any) => {
  const createNewExplorer = (id: string) => {
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: initialStateExplorer
      },
      allIds: [...state.allIds, id]
    };
  };

  switch (action.type) {
    case OPEN_EXPLORER:
      return createNewExplorer(action.id);
    case CLOSE_EXPLORER:
      const byId = state.byId;
      delete byId[action.id];
      return {
        ...state,
        byId: byId,
        allIds: state.allIds.filter(id => id !== action.id)
      };
    case LOADING:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], loading: true }
        }
      };
    case UPDATE_POSITION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], x: action.x, y: action.y }
        }
      };
    case UPDATE_SIZE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            width: action.width,
            height: action.height
          }
        }
      };
    case SET_SELECTED_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], selected: action.selected }
        }
      };
    case UNSET_FOCUS_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], selected: null }
        }
      };
    case SAVE_PREVIOUS_STATE: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            previousStates: [
              ...state.byId[action.id].previousStates,
              state.byId[action.id]
            ].slice(-20)
          }
        }
      };
    }
    case GO_PREVIOUS_STATE: {
      const explorerState = state.byId[action.id];
      const previousStates = explorerState.previousStates;
      console.log(previousStates);
      if (previousStates.length < 1) return state;
      const { x, y, height, width } = explorerState;
      const lastState = previousStates.pop();
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            ...lastState,
            previousStates,
            loading: false,
            x,
            y,
            height,
            width
          }
        }
      };
    }
    case SET_ITEMS: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            tracks: action.tracks,
            artists: action.artists,
            albums: action.albums,
            playlists: action.playlists,
            loading: false
          }
        }
      };
    }
    case SET_EXPLORER_METADATA:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            currentId: action.currentId,
            title: action.title,
            image: action.image,
            playlistable: action.playlistable
          }
        }
      };
    default:
      return state;
  }
};

export default explorer;
