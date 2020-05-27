import { CREATE_FILE, DELETE_FILE, MOVE_FILE } from "../actionTypes";
import { File, GenericFile, OPEN_FOLDER_ACTION } from "../types";
import { APPLY_SNAPSHOT } from "./index";

export interface DesktopState {
  byId: {
    [id: string]: GenericFile;
  };
  allIds: string[];
}

interface Point {
  x: number;
  y: number;
}

const generateGrid: () => Point[] = () => {
  let grid: Point[] = [];
  let minX = 20;
  let minY = 40;

  let maxX = window.innerWidth;
  let maxY = window.innerHeight;

  console.log(maxX, maxY);

  for (let row = 0; minX + row * 100 < maxX; row++) {
    let x = minX + row * 100;
    for (let col = 0; minY + col * 100 < maxY; col++) {
      let y = minY + col * 100;
      grid.push({ x, y });
    }
  }

  return grid;
};

const GRID = generateGrid();
console.log(GRID);

export const initialStateDesktop: DesktopState = {
  byId: {
    recently_played: {
      id: "recently_played",
      title: "Recently Played",
      isRenaming: false,
      locked: true,
      x: GRID[0].x,
      y: GRID[0].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.RECENTLY_PLAYED
      }
    },
    top_artists: {
      id: "top_artists",
      title: "Top Artists",
      isRenaming: false,
      locked: true,
      x: GRID[1].x,
      y: GRID[1].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.TOP
      }
    },
    my_albums: {
      id: "my_albums",
      title: "My albums",
      isRenaming: false,
      locked: true,
      x: GRID[2].x,
      y: GRID[2].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.LIBRARY_ALBUMS
      }
    },
    my_tracks: {
      id: "my_tracks",
      title: "My tracks",
      isRenaming: false,
      locked: true,
      x: GRID[3].x,
      y: GRID[3].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.LIBRARY_TRACKS
      }
    },
    my_playlists: {
      id: "my_playlists",
      title: "My playlists",
      isRenaming: false,
      locked: true,
      x: GRID[4].x,
      y: GRID[4].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.USER_PLAYLISTS
      }
    },
    winamp: {
      id: "winamp",
      title: "Winamp",
      isRenaming: false,
      locked: true,
      x: GRID[11].x,
      y: GRID[11].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.OPEN_WEBAMP
      }
    },
    settings: {
      id: "settings",
      title: "Settings",
      isRenaming: false,
      locked: true,
      x: GRID[9].x,
      y: GRID[9].y,
      metaData: {
        type: "action",
        action: OPEN_FOLDER_ACTION.SETTINGS
      }
    }
  },
  allIds: [
    "recently_played",
    "top_artists",
    "my_albums",
    "my_tracks",
    "my_playlists",
    "winamp",
    "settings"
  ]
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
      if (state.byId[action.payload.id]?.locked) return state;
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
