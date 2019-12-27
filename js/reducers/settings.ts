export interface SettingsState {
  showSettings: boolean;
  isDarkMode: boolean;
}

export const initialSettingsState: SettingsState = {
  showSettings: false,
  isDarkMode: false
};

export const TOGGLE_SETTINGS_MENU = "TOGGLE_SETTINGS_MENU";
export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";

const settings = (state: SettingsState = initialSettingsState, action: any) => {
  switch (action.type) {
    case TOGGLE_SETTINGS_MENU:
      return {
        ...state,
        showSettings: !state.showSettings
      };
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    default:
      return state;
  }
};

export default settings;
