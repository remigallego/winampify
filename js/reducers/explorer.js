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

/*

byId: [0: {}, 1: {}]
allIds: [0, 1] etc

*/

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
  loading: false
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
    case CREATE_NEW_EXPLORER:
      return createNewExplorer();
    case LOADING:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.id]: { ...state.byId[action.id], loading: true }
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
      const albumCovers = explorerState.albumCovers;
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
            albumCovers
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
