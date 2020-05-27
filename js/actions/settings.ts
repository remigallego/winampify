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
      const htmlDoc = window.document.getElementsByTagName("html");
      htmlDoc[0].style.background = `linear-gradient(
        184deg,
        rgba(97, 68, 255, 1) 0%,
        rgba(6, 46, 120, 1) 100%
      )`;
      dispatch({
        type: SET_THEME,
        payload: {
          theme: defaultTheme
        }
      });
    } else {
      const htmlDoc = window.document.getElementsByTagName("html");
      htmlDoc[0].style.background =
        "linear-gradient(184deg, rgba(18,12,47,1) 0%, rgba(6,1,31,1) 100%)";
      dispatch({
        type: SET_THEME,
        payload: {
          theme: darkTheme
        }
      });
    }
    dispatch({
      type: TOGGLE_DARK_MODE
    });
  };
}
