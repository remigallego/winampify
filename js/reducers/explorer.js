import {
  SET_SELECTED_EXPLORER,
  SET_ALBUMS_FROM_ARTIST,
  SET_TRACKS_FROM_ALBUM,
  SET_CURRENT_ID,
  GO_PREVIOUS_VIEW,
  UNSET_FOCUS_EXPLORER,
  SET_ARTISTS_FROM_USER,
  SET_TRACKS_FROM_PLAYLIST,
  SET_ARTISTS_FROM_SEARCH,
  SET_ALBUMS_FROM_LIBRARY
} from "../actionTypes";

const defaultExplorerState = {
  selected: null,
  view: null, // ['home', 'playlist', 'artist', 'album', 'search']
  currentId: null,
  title: null,
  image: null,
  artists: {},
  albums: {},
  tracks: {},
  playlists: {},
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
    case SET_ALBUMS_FROM_ARTIST: {
      const previous = state.previous;
      previous.unshift({ view: "artist", id: state.currentId });
      return {
        ...state,
        view: "artist",
        albums: action.albums,
        previous: previous
      };
    }
    case SET_TRACKS_FROM_ALBUM: {
      const previous = state.previous;
      previous.unshift({ view: "album", id: state.currentId });
      return {
        ...state,
        view: "album",
        tracks: action.tracks,
        previous: previous
      };
    }
    case SET_TRACKS_FROM_PLAYLIST: {
      const previous = state.previous;
      previous.unshift({ view: "album", id: state.currentId });
      return {
        ...state,
        view: "playlist",
        tracks: action.tracks,
        previous: previous
      };
    }
    case SET_ARTISTS_FROM_SEARCH: {
      const previous = state.previous;
      previous.unshift({ view: "search", id: state.currentId });
      return {
        ...state,
        view: "search",
        artists: action.artists,
        previous: previous
      };
    }
    case SET_ARTISTS_FROM_USER: {
      const previous = state.previous;
      previous.unshift({ view: "user", id: state.currentId });
      return {
        ...state,
        view: "user",
        artists: action.artists,
        previous: previous
      };
    }
    case SET_ALBUMS_FROM_LIBRARY: {
      const previous = state.previous;
      previous.unshift({ view: "artist", id: state.currentId });
      return {
        ...state,
        view: "artist",
        albums: action.albums,
        previous: previous
      };
    }
    default:
      return state;
  }
};

export default explorer;
