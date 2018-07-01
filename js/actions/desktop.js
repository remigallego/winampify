import uuidv1 from "uuid/v1";
import { CREATE_FILE } from "../actionTypes";

export function createFile(file) {
  return dispatch => {
    dispatch({ type: CREATE_FILE, payload: { ...file, id: uuidv1() } });
  };
}

export const moveFile = file => dispatch => {
  console.log(file.id);
  dispatch({
    type: "MOVE_FILE",
    payload: { id: file.id, x: file.x, y: file.y }
  });
};

export function selectFiles(state) {
  return state.desktop.allIds.map(id => state.desktop.byId[id]);
}
