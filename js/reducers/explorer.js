import {
  SET_SELECTED_EXPLORER,
  SET_ALBUMS,
  SET_TRACKS,
  SET_CURRENT_ID,
  UNSET_FOCUS_EXPLORER,
  SET_ARTISTS_FROM_USER
} from "../actionTypes";

const initialState = {
  selected: null,
  currentId: null,
  title: null,
  image: null,
  artists: null,
  albums: null,
  tracks: null,
  playlists: null
};

const explorer = (state = initialState, action) => {
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
    case SET_ALBUMS: {
      return {
        ...state,
        tracks: null,
        playlists: null,
        artists: null,
        albums: action.albums
      };
    }
    case SET_TRACKS: {
      return {
        ...state,
        albums: null,
        playlists: null,
        artists: null,
        tracks: action.tracks
      };
    }
    case SET_ARTISTS_FROM_USER: {
      return {
        ...state,
        albums: null,
        playlists: null,
        tracks: null,
        artists: action.artists
      };
    }
    default:
      return state;
  }
};

export default explorer;
