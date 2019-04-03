import { CREATE_FILE, MOVE_FILE, DELETE_FILE } from "../actionTypes";
import Desktop from "../components/Desktop";
import { File } from "../types";

export interface DesktopState {
  byId: {
    [id: number]: any;
  };
  allIds: number[];
}

const initialState: DesktopState = {
  byId: {},
  allIds: []
};

const cancelRenaming = (state: DesktopState) => {
  const byId = {};
  state.allIds.map((id: number) => {
    // @ts-ignore
    byId[id] = {
      ...state.byId[id],
      isRenaming: false
    };
  });
  return { byId: byId, allIds: state.allIds };
};

const createFile = (
  state: DesktopState,
  payload: { file: File; id: string }
) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [payload.id]: {
        ...payload.file,
        id: payload.id
      }
    },
    allIds: [...state.allIds, payload.id]
  };
};

const desktop = (state: DesktopState = initialState, action: any) => {
  switch (action.type) {
    case CREATE_FILE:
      return createFile(state, action.payload);
    case DELETE_FILE: {
      const { [action.payload.id]: omit, ...byId } = state.byId;
      const allIds = state.allIds.filter(id => id !== action.payload.id);
      return {
        ...state,
        byId,
        allIds
      };
    }
    case MOVE_FILE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            x: action.payload.x,
            y: action.payload.y
          }
        },
        allIds: [...state.allIds]
      };
    case "RENAMING":
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            isRenaming: true
          }
        },
        allIds: [...state.allIds]
      };
    case "RENAMING_SUCCESS":
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            title: action.payload.title,
            isRenaming: false
          }
        },
        allIds: [...state.allIds]
      };
    case "RENAMING_CANCEL":
      return cancelRenaming(state);
    default:
      return state;
  }
};

export default desktop;
