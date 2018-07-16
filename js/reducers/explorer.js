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

const initialState = {
  // metadata
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
  // images
  albumCovers: {}
};

const explorer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case SET_SELECTED_EXPLORER:
      return { ...state, selected: action.selected };
    case UNSET_FOCUS_EXPLORER:
      return { ...state, selected: null };
    case SAVE_PREVIOUS_STATE: {
      return {
        ...state,
        previousStates: [...state.previousStates, state].slice(-20) // Limits the size of the state history
      };
    }
    case GO_PREVIOUS_STATE: {
      const previousStates = state.previousStates;
      const lastState = previousStates.pop();
      return {
        ...state,
        ...lastState,
        previousStates,
        loading: false
      };
    }
    case SET_ITEMS: {
      return {
        ...state,
        tracks: action.tracks,
        artists: action.artists,
        albums: action.albums,
        playlists: action.playlists,
        loading: false
      };
    }
    case SET_EXPLORER_METADATA:
      return {
        ...state,
        currentId: action.currentId,
        title: action.title,
        image: action.image,
        playlistable: action.playlistable
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
