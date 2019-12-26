import _ from "lodash";
import { CLOSE_IMAGE, OPEN_IMAGE } from "../actions/images";
import { CLOSE_EXPLORER, OPEN_EXPLORER } from "./explorer";
import { findHighestPosition } from "../utils/windows";

export enum WINDOW_TYPE {
  Explorer,
  Image,
  Webamp
}

export interface Window {
  id: string;
  type: WINDOW_TYPE;
  position: number;
}

export interface WindowsState {
  windows: Window[];
}

export const initialStateWindows: WindowsState = {
  windows: [{ id: "webamp", type: WINDOW_TYPE.Webamp, position: 1 }]
};

export const SET_ON_TOP = "SET_ON_TOP";

const windowsReducer = (
  state: WindowsState = initialStateWindows,
  action: any
) => {
  switch (action.type) {
    case OPEN_EXPLORER: {
      const { windows } = state;
      windows.push({
        id: action.payload.id,
        type: WINDOW_TYPE.Explorer,
        position: findHighestPosition(windows) + 1
      });
      return { ...state, windows };
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
        type: WINDOW_TYPE.Image,
        position: findHighestPosition(windows) + 1
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
    case SET_ON_TOP: {
      const { windows } = state;
      const windowToMove = state.windows.find(
        window => window.id === action.id
      );

      return {
        windows: windows.map(window => {
          if (window.id === action.id) {
            return {
              ...windowToMove,
              position: findHighestPosition(windows) + 1
            };
          } else return window;
        })
      };
    }
    default:
      return state;
  }
};

export default windowsReducer;
