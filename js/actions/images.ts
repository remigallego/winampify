import { Action, Dispatch } from "redux";
import { generateImagesId } from "../utils/images";
import { ImageFile } from "../types";
export const OPEN_IMAGE = "OPEN_IMAGE";
export const CLOSE_IMAGE = "CLOSE_IMAGE";

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
