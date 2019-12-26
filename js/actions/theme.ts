import { Action, Dispatch } from "redux";
import { SET_THEME, ThemeState } from "../reducers/theme";

export function setTheme(theme: ThemeState) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: SET_THEME,
      payload: {
        theme
      }
    });
  };
}
