import _ from "lodash";
import { CLOSE_IMAGE, OPEN_IMAGE } from "../actions/images";
import { APPLY_SNAPSHOT } from "./";
import { CLOSE_EXPLORER, OPEN_EXPLORER } from "./explorer";

export enum WINDOW_TYPE {
  Explorer,
  Image,
  Webamp
}

export interface Window {
  id: string;
  type: WINDOW_TYPE;
  /*   x: number;
  y: number;
  height: number;
  width: number; */
}

export interface WindowsState {
  windows: Window[];
}

export const initialStateWindows: WindowsState = {
  windows: [{ id: "webamp", type: WINDOW_TYPE.Webamp }]
};

const windows = (state: WindowsState = initialStateWindows, action: any) => {
  switch (action.type) {
    case OPEN_EXPLORER: {
      const { windows } = state;
      windows.push({
        id: action.payload.id,
        type: WINDOW_TYPE.Explorer
        /*  x: action.payload.x,
        y: action.payload.y,
        height: 500,
        width: 400 */
      });
      return { windows };
    }
    case CLOSE_EXPLORER: {
      const { windows } = state;
      return {
        windows: windows.filter(window => window.id !== action.payload.id)
      };
    }
    case OPEN_IMAGE: {
      const windows = state.windows;
      windows.push({
        id: action.payload.id,
        type: WINDOW_TYPE.Image
        /*  x: action.payload.x,
        y: action.payload.y,
        height: 200,
        width: 200 */
      });
      return { windows };
    }
    case CLOSE_IMAGE: {
      // TODO: Can be more generic and be called "CLOSE WINDOW"
      const windowToRemove = state.windows.find(
        window => window.id === action.payload.id
      );
      return { windows: _.without(state.windows, windowToRemove) };
    }
    case "SET_ON_TOP": {
      const windowToMove = state.windows.find(
        window => window.id === action.id
      );
      const windows = _.without(state.windows, windowToMove);
      windows.push(windowToMove);
      return { windows };
    }
    /* case UPDATE_POSITION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id]
          }
        }
      };
    case UPDATE_SIZE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id]
          }
        }
      }; */
    case APPLY_SNAPSHOT:
      return { ...action.payload.snapshot.windows };
    default:
      return state;
  }
};

export default windows;
