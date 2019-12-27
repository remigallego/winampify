import { Action, Dispatch } from "redux";
import { TOGGLE_SETTINGS_MENU, TOGGLE_DARK_MODE } from "../reducers/settings";
import { AppState } from "../reducers";
import { SET_THEME } from "../reducers/theme";
import { defaultTheme, darkTheme } from "../styles/themes";

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
