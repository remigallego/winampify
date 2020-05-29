import _ from "lodash";
import { CLOSE_IMAGE, OPEN_IMAGE } from "../actions/images";
import { findHighestPosition } from "../utils/windows";
import { CLOSE_EXPLORER, OPEN_EXPLORER } from "./explorer";

export enum WINDOW_TYPE {
  Explorer,
  Image,
  Webamp
}

export interface Window {
  id: string;
  type: WINDOW_TYPE;
  position: number;
  minimized: boolean;
}

export interface WindowsState {
  windows: Window[];
}

export const initialStateWindows: WindowsState = {
  windows: [
    { id: "webamp", type: WINDOW_TYPE.Webamp, position: 1, minimized: false }
  ]
};

export const SET_ON_TOP = "SET_ON_TOP";
export const TOGGLE_MINIMIZE = "TOGGLE_MINIMIZE";

const windowsReducer = (
  state: WindowsState = initialStateWindows,
  action: any
) => {
  switch (action.type) {
    case OPEN_EXPLORER: {
      const oldArray = state.windows;
      return {
        ...state,
        windows: [
          ...oldArray,
          {
            id: action.payload.id,
            type: WINDOW_TYPE.Explorer,
            position: findHighestPosition(oldArray) + 1,
            minimized: false
          }
        ]
      };
    }
    case CLOSE_EXPLORER: {
      const { windows } = state;
      return {
        windows: windows.filter(window => window.id !== action.payload.id)
      };
    }
    case TOGGLE_MINIMIZE: {
      const { windows } = state;
      const windowToMove = state.windows.find(
        window => window.id === action.id
      );

      return {
        windows: windows.map(window => {
          if (window.id === action.id) {
            return {
              ...windowToMove,
              minimized: !window.minimized
            };
          } else return window;
        })
      };
    }
    case OPEN_IMAGE: {
      const oldArray = state.windows;
      return {
        ...state,
        windows: [
          ...oldArray,
          {
            id: action.payload.id,
            type: WINDOW_TYPE.Image,
            position: findHighestPosition(oldArray) + 1,
            minimized: false
          }
        ]
      };
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
