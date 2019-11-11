import { CREATE_FILE, DELETE_FILE, MOVE_FILE } from "../actionTypes";
import { ACTION_TYPE, File, GenericFile } from "../types";
import { APPLY_SNAPSHOT } from "./index";

export interface DesktopState {
  byId: {
    [id: string]: GenericFile;
  };
  allIds: string[];
}

export const initialStateDesktop: DesktopState = {
  byId: {
    recently_played: {
      id: "recently_played",
      title: "Recently Played",
      isRenaming: false,
      locked: true,
      x: 20,
      y: 40,
      metaData: {
        type: "action",
        action: ACTION_TYPE.RECENTLY_PLAYED
      }
    },
    top_artists: {
      id: "top_artists",
      title: "Top Artists",
      isRenaming: false,
      locked: true,
      x: 20,
      y: 140,
      metaData: {
        type: "action",
        action: ACTION_TYPE.TOP
      }
    },
    my_albums: {
      id: "my_albums",
      title: "My albums",
      isRenaming: false,
      locked: true,
      x: 20,
      y: 220,
      metaData: {
        type: "action",
        action: ACTION_TYPE.LIBRARY_ALBUMS
      }
    },
    my_tracks: {
      id: "my_tracks",
      title: "My tracks",
      isRenaming: false,
      locked: true,
      x: 20,
      y: 300,
      metaData: {
        type: "action",
        action: ACTION_TYPE.LIBRARY_TRACKS
      }
    }
  },
  allIds: ["recently_played", "top_artists", "my_albums", "my_tracks"]
};

const cancelRenaming = (state: DesktopState) => {
  const byId = {};
  state.allIds.map((id: string) => {
    // @ts-ignore
    byId[id] = {
      ...state.byId[id],
      isRenaming: false
    };
  });
  return { byId, allIds: state.allIds };
};

const createFile = (
  state: DesktopState,
  payload: { file: GenericFile; id: string }
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

const desktop = (state: DesktopState = initialStateDesktop, action: any) => {
  switch (action.type) {
    case CREATE_FILE:
      return createFile(state, action.payload);
    case DELETE_FILE: {
      if (state.byId[action.payload.id].locked) return;
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
    case APPLY_SNAPSHOT:
      return action.payload.snapshot.desktop;
    default:
      return state;
  }
};

export default desktop;
