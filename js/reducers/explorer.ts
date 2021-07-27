import uuidv1 from "uuid/v1";
import {
  GO_PREVIOUS_STATE,
  LOADING,
  SAVE_PREVIOUS_STATE,
  SET_EXPLORER_METADATA,
  SET_ITEMS,
  SET_SELECTED_EXPLORER,
  UNSET_FOCUS_EXPLORER
} from "../actionTypes";
import { GenericFile, OPEN_FOLDER_ACTION } from "../types";

export interface ToolbarParameter {
  title: string;
  width: number;
  offset: number;
}

export interface ToolbarParams {
  [id: string]: ToolbarParameter;
}

export interface SingleExplorerState {
  id: string;
  selectedFiles: string[];
  query: string;
  title: any;
  previousStates: any[];
  loading: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  scrollOffset: number;
  minimized: boolean;
  files: GenericFile[];
  dropEnabled: boolean;
  uri: string;
  action: OPEN_FOLDER_ACTION;

  toolbarParams: ToolbarParams;
}

export interface ExplorerState {
  byId: {
    [id: string]: SingleExplorerState;
  };
  allIds: string[];
}

const initialStateExplorer: SingleExplorerState = {
  id: "",
  selectedFiles: [],

  title: null,
  previousStates: [],

  // search
  query: null,

  // items
  files: [],
  loading: false,

  // position
  width: 500,
  height: 500,
  x: 0,
  y: 0,
  scrollOffset: 0,
  minimized: false,

  // extras
  dropEnabled: false,
  uri: "",

  action: null,

  toolbarParams: {
    Name: {
      title: "Name",
      width: 180,
      offset: 0
    },
    Duration: {
      title: "Duration",
      width: 120,
      offset: 0
    },
    /*  Album: {
      title: "Album",
      width: 120,
      offset: 0
    }, */
    Artist: {
      title: "Artist",
      width: 140,
      offset: 0
    }
    /*   Track: {
      title: "Track",
      width: 120,
      offset: 0
    } */
  }
};

export const initialStateExplorerState: ExplorerState = {
  byId: {},
  allIds: []
};

export const OPEN_EXPLORER = "OPEN_EXPLORER";
export const CLOSE_EXPLORER = "CLOSE_EXPLORER";
export const UPDATE_POSITION = "UPDATE_POSITION";
export const UPDATE_SIZE = "UPDATE_SIZE";
export const SET_MORE_ITEMS = "SET_MORE_ITEMS";
export const SET_SEARCH_METADATA = "SET_SEARCH_METADATA";
export const SET_SCROLL_OFFSET = "SET_SCROLL_OFFSET";
export const RESET_SCROLL_OFFSET = "RESET_SCROLL_OFFSET";
export const MINIMIZE_EXPLORER = "MINIMIZE_EXPLORER";
export const UPDATE_OFFSET_PARAMETER = "UPDATE_OFFSET_PARAMETER";
export const COMMIT_OFFSET_PARAMETER = "COMMIT_OFFSET_PARAMETER";

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

const setMoreItems = (
  state: ExplorerState,
  payload: { id: string; files: File[] }
) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        files: [
          ...state.byId[payload.id].files,
          ...payload.files.map(formatToFile)
        ],
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
      [id]: { ...initialStateExplorer, id, x, y }
    },
    allIds: [...state.allIds, id]
  };
};

export const formatToFile = (item: any) => {
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

const setExplorerMetadata = (state: ExplorerState, payload: any) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        ...payload
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

const updateOffsetParameter = (
  state: ExplorerState,
  payload: { id: string; title: string; offset: number }
) => {
  const parameters = state.byId[payload.id].toolbarParams;
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        toolbarParams: {
          ...parameters,
          [payload.title]: {
            ...parameters[payload.title],
            offset: payload.offset
          }
        }
      }
    }
  };
};

const commitOffsetParameter = (
  state: ExplorerState,
  payload: { id: string; title: string }
) => {
  const parameters = state.byId[payload.id].toolbarParams;
  const width = state.byId[payload.id].toolbarParams[payload.title].width;
  const offset = state.byId[payload.id].toolbarParams[payload.title].offset;
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...state.byId[payload.id],
        toolbarParams: {
          ...parameters,
          [payload.title]: {
            ...parameters[payload.title],
            offset: 0,
            width: width + offset
          }
        }
      }
    }
  };
};

const explorer = (state = initialStateExplorerState, action: any) => {
  switch (action.type) {
    case OPEN_EXPLORER:
      return createNewExplorer(state, action.payload);
    case CLOSE_EXPLORER:
      const { [action.payload.id]: omit, ...byId } = state.byId;
      return {
        ...state,
        byId,
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
    case UPDATE_SIZE: {
      const newWidth = action.width;
      const toolbarParams = state.byId[action.id].toolbarParams;
      let newToolbarParams = { ...toolbarParams };
      const cumulatedWidth = Object.values(toolbarParams).reduce(
        (acc, curr) => {
          return acc + curr.width;
        },
        0
      );
      if (cumulatedWidth > action.width) {
        const toRemove = Math.ceil(
          (cumulatedWidth + 20 - action.width) /
            Object.values(toolbarParams).length
        );
        Object.keys(toolbarParams).map(key => {
          newToolbarParams[key].width = newToolbarParams[key].width - toRemove;
        });
      }
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            width: action.width,
            height: action.height,
            toolbarParams: newToolbarParams
          }
        }
      };
    }
    case SET_SELECTED_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            selectedFiles: action.payload.selectedFiles
          }
        }
      };
    case UNSET_FOCUS_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], selectedFiles: [] }
        }
      };
    case SAVE_PREVIOUS_STATE:
      return savePreviousState(state, action.payload);
    case GO_PREVIOUS_STATE:
      return goPreviousStateUpdate(state, action.payload);
    case SET_ITEMS:
      return setItems(state, action.payload);
    case SET_MORE_ITEMS:
      return setMoreItems(state, action.payload);
    case SET_EXPLORER_METADATA:
      return setExplorerMetadata(state, action.payload);
    case SET_SCROLL_OFFSET:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            scrollOffset: action.payload.scrollOffset
          }
        }
      };
    case RESET_SCROLL_OFFSET:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            scrollOffset: 0
          }
        }
      };
    case UPDATE_OFFSET_PARAMETER:
      return updateOffsetParameter(state, action.payload);
    case COMMIT_OFFSET_PARAMETER:
      return commitOffsetParameter(state, action.payload);
    default:
      return state;
  }
};

export default explorer;
