import _ from "lodash";
import { OPEN_EXPLORER } from "./explorer";
import { OPEN_IMAGE, CLOSE_IMAGE } from "../actions/images";

export enum WindowType {
  Explorer,
  Image
}

export interface Window {
  id: string;
  type: WindowType;
}

export interface WindowsState {
  windows: Array<Window>;
}

const initialState: WindowsState = {
  windows: []
};

const windows = (state: WindowsState = initialState, action: any) => {
  switch (action.type) {
    case OPEN_EXPLORER: {
      const { windows } = state;
      windows.push({ id: action.id, type: WindowType.Explorer });
      return { windows };
    }
    case OPEN_IMAGE: {
      const windows = state.windows;
      windows.push({ id: action.id, type: WindowType.Image });
      return { windows };
    }
    case CLOSE_IMAGE: {
      // TODO: Can be more generic and be called "CLOSE WINDOW"
      const windowToRemove = state.windows.find(
        window => window.id === action.id
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
    default:
      return state;
  }
};

export default windows;
