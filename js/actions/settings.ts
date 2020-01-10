import { Action, Dispatch } from "redux";
import { AppState } from "../reducers";
import { TOGGLE_DARK_MODE, TOGGLE_SETTINGS_MENU } from "../reducers/settings";
import { SET_THEME } from "../reducers/theme";
import { darkTheme, defaultTheme } from "../styles/themes";

export function toggleSettingsMenu() {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: TOGGLE_SETTINGS_MENU
    });
  };
}

export function toggleDarkMode() {
  return (dispatch: Dispatch<Action>, getState: () => AppState) => {
    if (getState().settings.isDarkMode) {
      dispatch({
        type: SET_THEME,
        payload: {
          theme: defaultTheme
        }
      });
    } else
      dispatch({
        type: SET_THEME,
        payload: {
          theme: darkTheme
        }
      });
    dispatch({
      type: TOGGLE_DARK_MODE
    });
  };
}
