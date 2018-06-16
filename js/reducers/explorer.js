import {
  SET_SELECTED_EXPLORER,
  SET_ALBUMS,
  SET_TRACKS,
  SET_CURRENT_ID,
  GO_PREVIOUS_VIEW,
  UNSET_FOCUS_EXPLORER,
  SET_ARTISTS_FROM_USER
} from "../actionTypes";

const defaultExplorerState = {
  selected: null,
  currentId: null,
  title: null,
  image: null,
  artists: null,
  albums: null,
  tracks: null,
  playlists: null,
  previous: [] /* view: null, id: null  */
};

const explorer = (state = defaultExplorerState, action) => {
  switch (action.type) {
    case SET_SELECTED_EXPLORER:
      return { ...state, selected: action.selected };
    case UNSET_FOCUS_EXPLORER:
      return { ...state, selected: null };
    case SET_CURRENT_ID:
      return {
        ...state,
        currentId: action.currentId,
        title: action.title,
        image: action.image
      };
    case GO_PREVIOUS_VIEW: {
      const previous = state.previous;
      previous.shift();
      return {
        ...state,
        currentId: state.previous[0].id,
        view: state.previous[0].view,
        previous: previous
      };
    }
    case SET_ALBUMS: {
      const previous = state.previous;
      previous.unshift({ view: "artist", id: state.currentId });
      return {
        ...state,
        tracks: null,
        playlists: null,
        artists: null,
        albums: action.albums,
        previous: previous
      };
    }
    case SET_TRACKS: {
      const previous = state.previous;
      previous.unshift({ view: "album", id: state.currentId });
      return {
        ...state,
        albums: null,
        playlists: null,
        artists: null,
        tracks: action.tracks,
        previous: previous
      };
    }
    case SET_ARTISTS_FROM_USER: {
      const previous = state.previous;
      previous.unshift({ view: "user", id: state.currentId });
      return {
        ...state,
        albums: null,
        playlists: null,
        tracks: null,
        artists: action.artists,
        previous: previous
      };
    }
    default:
      return state;
  }
};

export default explorer;
