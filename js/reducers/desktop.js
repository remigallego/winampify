import { CREATE_FILE } from "../actionTypes";
const initialState = {
  byId: {},
  allIds: []
};

const desktop = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_FILE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            id: action.payload.id,
            x: action.payload.x,
            y: action.payload.y,
            title: action.payload.title,
            type: action.payload.type
          }
        },
        allIds: [...state.allIds, action.payload.id]
      };
    default:
      return state;
  }
};

export default desktop;
