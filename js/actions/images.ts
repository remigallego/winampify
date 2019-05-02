import { Dispatch, Action } from "redux";
import { generateImagesId } from "../utils/images";
export const OPEN_IMAGE = "OPEN_IMAGE";
export const CLOSE_IMAGE = "CLOSE_IMAGE";

export function openImage(
  source: string,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: OPEN_IMAGE,
      id: generateImagesId(),
      source,
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    });
  };
}

export function closeImage(id: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: CLOSE_IMAGE,
      id
    });
  };
}
