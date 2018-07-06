import uuidv1 from "uuid/v1";
import { createSelector } from "reselect";
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

export const deleteFile = fileId => dispatch => {
  console.log(fileId);
  dispatch({
    type: "DELETE_FILE",
    payload: { id: fileId }
  });
};

export const renameFile = file => dispatch => {
  dispatch({
    type: "RESET_RENAMING" // TODO:
  });
  dispatch({
    type: "RENAMING",
    payload: { id: file.id }
  });
};

export const cancelRenaming = () => dispatch => {
  dispatch({
    type: "RENAMING_CANCEL"
  });
};

export const confirmRenameFile = (file, title) => dispatch => {
  dispatch({
    type: "RENAMING_SUCCESS",
    payload: { id: file.id, title }
  });
};

export const getDesktop = state => state.desktop;

export const selectFiles = createSelector([getDesktop], desktop => {
  return desktop.allIds.map(id => desktop.byId[id]);
});
