import { CREATE_FILE } from "../actionTypes";

export function createFile(file) {
  return dispatch => {
    dispatch({ type: CREATE_FILE, payload: file });
  };
}

export function selectFiles(state) {
  return state.desktop.allIds.map(id => state.desktop.byId[id]);
}
