import { Action, Dispatch } from "redux";
import { createSelector } from "reselect";
import uuidv1 from "uuid/v1";
import { CREATE_FILE } from "../actionTypes";
import { AppState } from "../reducers";
import { GenericFile } from "../types";

export function createFile(file: GenericFile) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: CREATE_FILE, payload: { file, id: uuidv1() } });
  };
}

export const moveFile = (file: GenericFile) => (dispatch: Dispatch<Action>) => {
  dispatch({
    type: "MOVE_FILE",
    payload: { id: file.id, x: file.x, y: file.y }
  });
};

export const deleteFile = (fileId: string) => (dispatch: Dispatch<Action>) => {
  dispatch({
    type: "DELETE_FILE",
    payload: { id: fileId }
  });
};

export const renameFile = (fileId: string) => (dispatch: Dispatch<Action>) => {
  dispatch({
    type: "RESET_RENAMING" // TODO:
  });
  dispatch({
    type: "RENAMING",
    payload: { id: fileId }
  });
};

export const cancelRenaming = () => (dispatch: Dispatch<Action>) => {
  dispatch({
    type: "RENAMING_CANCEL"
  });
};

export const confirmRenameFile = (file: GenericFile, title: string) => (
  dispatch: Dispatch<Action>
) => {
  dispatch({
    type: "RENAMING_SUCCESS",
    payload: { id: file.id, title }
  });
};

export const getDesktop = (state: AppState) => state.desktop;

export const selectFiles = createSelector(
  [getDesktop],
  desktop => {
    return desktop.allIds.map(id => desktop.byId[id]);
  }
);
