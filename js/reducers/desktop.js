import { CREATE_FILE, MOVE_FILE } from "../actionTypes";
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
            uri: action.payload.uri,
            x: action.payload.x,
            y: action.payload.y,
            title: action.payload.title,
            type: action.payload.type,
            renaming: false
          }
        },
        allIds: [...state.allIds, action.payload.id]
      };
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
            renaming: true
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
            renaming: false
          }
        },
        allIds: [...state.allIds]
      };
    default:
      return state;
  }
};

export default desktop;
