import { defaultTheme } from "../styles/themes";

export interface ThemeState {
  explorer: {
    bg: string;
    bgDrop: string;
    title: {
      bg: string;
    };
    file: {
      text: string;
    };
    toolbar: {
      bg: string;
      icon: string;
      iconDisabled: string;
    };
    scroll: string;
  };
}

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
