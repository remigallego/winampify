import { Action, Dispatch } from "redux";
import { ImageFile } from "../types";
import { generateImagesId } from "../utils/images";

export const OPEN_IMAGE = "OPEN_IMAGE";
export const CLOSE_IMAGE = "CLOSE_IMAGE";
export const ON_DRAG_START = "ON_DRAG_START";
export const ON_DRAG_STOP = "ON_DRAG_STOP";

export function openImage(
  imageFile: ImageFile,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: OPEN_IMAGE,
      payload: {
        id: generateImagesId(),
        source: imageFile.metaData.url,
        title: imageFile.title,
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY
      }
    });
  };
}

export function onDragStart(id: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ON_DRAG_START,
      payload: {
        id
      }
    });
  };
}

export function onDragStop(id: string, x: number, y: number) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ON_DRAG_STOP,
      payload: {
        id,
        x: x,
        y: y
      }
    });
  };
}

export function closeImage(id: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: CLOSE_IMAGE,
      payload: {
        id
      }
    });
  };
}
