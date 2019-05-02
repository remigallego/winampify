import { Image } from "../types";
import _ from "lodash";
import { OPEN_IMAGE, CLOSE_IMAGE } from "../actions/images";

export interface ImagesState {
  byId: {
    [id: string]: Image;
  };
  allIds: string[];
}

const initialState: ImagesState = {
  byId: {},
  allIds: []
};

const images = (state: ImagesState = initialState, action: any) => {
  switch (action.type) {
    case OPEN_IMAGE:
      return openImage(state, action);
    case CLOSE_IMAGE:
      return closeImage(state, action);
    default:
      return state;
  }
};

const openImage = (state: ImagesState, action: any) => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.id]: {
        id: action.id,
        source: action.source,
        x: action.x,
        y: action.y
      }
    },
    allIds: [...new Set([...state.allIds, action.id])]
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
