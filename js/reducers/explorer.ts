import uuidv1 from "uuid/v1";
import {
  SET_SELECTED_EXPLORER,
  SET_EXPLORER_METADATA,
  UNSET_FOCUS_EXPLORER,
  SET_ITEMS,
  GO_PREVIOUS_STATE,
  SAVE_PREVIOUS_STATE,
  LOADING
} from "../actionTypes";

export interface SingleExplorerState {
  selected: any;
  currentId: any;
  title: any;
  image: any;
  previousStates: Array<any>;
  loading: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  files: Array<File> | null;
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
  previousStates: [],
  // items
  files: null,
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

const setItems = (
  state: ExplorerState,
  payload: { id: string; files: File[] }
) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        files: payload.files.map(formatToFile),
        loading: false
      }
    }
  };
};

const createNewExplorer = (state: ExplorerState, payload: any) => {
  const { id, x, y } = payload;
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: { ...initialStateExplorer, x, y }
    },
    allIds: [...state.allIds, id]
  };
};

const formatToFile = (item: any) => {
  const getFileTitle = () => {
    if (item.type === "track") {
      return `${item.artists[0].name} - ${item.name}`;
    }
    return item.name;
  };
  return {
    metaData: item,
    id: uuidv1(),
    isRenaming: false,
    title: getFileTitle(),
    x: 0,
    y: 0
  };
};

const goPreviousStateUpdate = (state: ExplorerState, payload: any) => {
  const explorerState = state.byId[payload.id];
  const previousStates = explorerState.previousStates;
  if (previousStates.length < 1) return state;
  const { x, y, height, width } = explorerState;
  const lastState = previousStates.pop();
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
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
};

const setExplorerMetadata = (
  state: ExplorerState,
  payload: { id: string; currentId: string; title: string; image: any }
) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        currentId: payload.currentId,
        title: payload.title,
        image: payload.image
      }
    }
  };
};

const savePreviousState = (state: ExplorerState, payload: { id: string }) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        previousStates: [
          ...state.byId[payload.id].previousStates,
          state.byId[payload.id]
        ].slice(-20)
      }
    }
  };
};

const explorer = (state = initialState, action: any) => {
  switch (action.type) {
    case OPEN_EXPLORER:
      return createNewExplorer(state, action.payload);
    case CLOSE_EXPLORER:
      const { [action.payload.id]: omit, ...byId } = state.byId;
      return {
        ...state,
        byId: byId,
        allIds: state.allIds.filter(id => id !== action.payload.id)
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
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            x: action.payload.x,
            y: action.payload.y
          }
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
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            selected: action.payload.selected
          }
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
    case SAVE_PREVIOUS_STATE:
      return savePreviousState(state, action.payload);
    case GO_PREVIOUS_STATE:
      return goPreviousStateUpdate(state, action.payload);
    case SET_ITEMS:
      return setItems(state, action.payload);
    case SET_EXPLORER_METADATA:
      return setExplorerMetadata(state, action.payload);
    default:
      return state;
  }
};

export default explorer;
