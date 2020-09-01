import _ from "lodash";
import {
  CLOSE_IMAGE,
  OPEN_IMAGE,
  ON_DRAG_STOP,
  ON_DRAG_START
} from "../actions/images";
import { ImageDialogType } from "../types";

export interface ImagesState {
  byId: {
    [id: string]: ImageDialogType;
  };
  allIds: string[];
}

export const initialStateImages: ImagesState = {
  byId: {},
  allIds: []
};

const images = (state: ImagesState = initialStateImages, action: any) => {
  switch (action.type) {
    case OPEN_IMAGE:
      return openImage(state, action);
    case CLOSE_IMAGE:
      return closeImage(state, action);
    case ON_DRAG_START:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            isDragging: true
          }
        }
      };
    case ON_DRAG_STOP:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            x: action.payload.x,
            y: action.payload.y,
            isDragging: false
          }
        }
      };
    default:
      return state;
  }
};

const openImage = (state: ImagesState, action: any) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.payload.id]: {
        id: action.payload.id,
        source: action.payload.source,
        x: action.payload.x,
        y: action.payload.y,
        title: action.payload.title
      }
    },
    allIds: [...new Set([...state.allIds, action.payload.id])]
  };
};

const closeImage = (state: ImagesState, action: any) => {
  return {
    ...state,
    byId: _.omit(state.byId, [action.id]),
    allIds: _.without(state.allIds, action.id)
  };
};

export default images;
