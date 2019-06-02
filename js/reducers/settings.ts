import { THEMES } from "../styles/themes";

export interface SettingsState {
  theme: THEMES;
}

export const initialStateSettings: SettingsState = {
  theme: THEMES.DEFAULT
};

export const APPLY_THEME = "APPLY_THEME";

const settings = (state: SettingsState = initialStateSettings, action: any) => {
  switch (action.type) {
    case APPLY_THEME:
      return { ...state, theme: action.payload.theme };
    default:
      return state;
  }
};

export default settings;
