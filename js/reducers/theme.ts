import { defaultTheme } from "../styles/themes";
import { Theme } from "../styles/themes";

export type ThemeState = Theme;

export const initialStateTheme: ThemeState = defaultTheme;

export const SET_THEME = "SET_THEME";

const theme = (state: ThemeState = initialStateTheme, action: any) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, ...action.payload.theme };
    default:
      return state;
  }
};

export default theme;
