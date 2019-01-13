import {
  SET_SELECTED_EXPLORER,
  SET_EXPLORER_METADATA,
  UNSET_FOCUS_EXPLORER,
  SET_ITEMS,
  GO_PREVIOUS_STATE,
  SAVE_PREVIOUS_STATE,
  LOADING,
  ADD_IMAGE,
  CLOSE_IMAGE
} from "../actionTypes";

const initialStateExplorer = {
  selected: null,
  currentId: null,
  title: null,
  image: null,
  playlistable: false, // Is this ever useful?
  previousStates: [],
  // items
  artists: null,
  albums: null,
  tracks: null,
  playlists: null,
  loading: false,
  // position
  width: 400,
  height: 500,
  x: 0,
  y: 0
};

const initialState = {
  byId: {
    0: initialStateExplorer
  },
  allIds: [0],
  // images
  albumCovers: {}
};

const CREATE_NEW_EXPLORER = "CREATE_NEW_EXPLORER";
const CLOSE_EXPLORER = "CLOSE_EXPLORER";
const UPDATE_POSITION = "UPDATE_POSITION";
const UPDATE_SIZE = "UPDATE_SIZE";
const SET_ON_TOP = "SET_ON_TOP";

const explorer = (state = initialState, action) => {
  const createNewExplorer = () => {
    const newId = state.allIds.length;
    return {
      ...state,
      byId: {
        ...state.byId,
        [newId]: initialStateExplorer
      },
      allIds: [...state.allIds, newId]
    };
  };

  switch (action.type) {
    case SET_ON_TOP:
      if (state.allIds.length === 1) return state;
      const array = state.allIds.filter(id => id !== action.id);
      array.push(action.id);
      return {
        ...state,
        allIds: array
      };
    case CREATE_NEW_EXPLORER:
      return createNewExplorer();
    case CLOSE_EXPLORER:
      const byId = state.byId;
      delete byId[action.id];
      return {
        ...state,
        byId: byId,
        allIds: state.allIds.filter(id => id !== action.id)
      };
    case LOADING:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], loading: true }
        }
      };
    case UPDATE_POSITION:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], x: action.x, y: action.y }
        }
      };
    case UPDATE_SIZE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            width: action.width,
            height: action.height
          }
        }
      };
    case SET_SELECTED_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], selected: action.selected }
        }
      };
    case UNSET_FOCUS_EXPLORER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], selected: null }
        }
      };
    case SAVE_PREVIOUS_STATE: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            previousStates: [
              ...state.byId[action.id].previousStates,
              state.byId[action.id]
            ].slice(-20)
          }
        }
      };
    }
    case GO_PREVIOUS_STATE: {
      const explorerState = state.byId[action.id];
      const previousStates = explorerState.previousStates;
      console.log(previousStates);
      if (previousStates.length < 1) return state;
      const { albumCovers, x, y, height, width } = explorerState;
      const lastState = previousStates.pop();
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            ...lastState,
            previousStates,
            loading: false,
            albumCovers,
            x,
            y,
            height,
            width
          }
        }
      };
    }
    case SET_ITEMS: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            tracks: action.tracks,
            artists: action.artists,
            albums: action.albums,
            playlists: action.playlists,
            loading: false
          }
        }
      };
    }
    case SET_EXPLORER_METADATA:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: {
            ...state.byId[action.id],
            currentId: action.currentId,
            title: action.title,
            image: action.image,
            playlistable: action.playlistable
          }
        }
      };
    case ADD_IMAGE: {
      return {
        ...state,
        albumCovers: {
          ...state.albumCovers,
          [action.id]: { source: action.source, x: action.x, y: action.y }
        }
      };
    }
    case CLOSE_IMAGE: {
      const { [action.id]: omit, ...albumCovers } = state.albumCovers;
      return {
        ...state,
        albumCovers
      };
    }
    default:
      return state;
  }
};

export default explorer;
