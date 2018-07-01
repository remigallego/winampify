import uuidv1 from "uuid/v1";
import { CREATE_FILE } from "../actionTypes";

export function createFile(file) {
  return dispatch => {
    dispatch({ type: CREATE_FILE, payload: { ...file, id: uuidv1() } });
  };
}

export const moveFile = file => (dispatch, getState) => {
  const findIdFromURI = () =>
    getState().desktop.allIds.find(id => {
      return getState().desktop.byId[id].uri === file.uri;
    });
  const id = findIdFromURI();
  console.log(id);
  dispatch({
    type: "MOVE_FILE",
    payload: { id, x: file.x, y: file.y }
  });
};

export function selectFiles(state) {
  return state.desktop.allIds.map(id => state.desktop.byId[id]);
}

// Utils
