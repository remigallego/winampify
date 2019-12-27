import { combineReducers } from "redux";
import { defaultTheme } from "../styles/themes";
import auth, { AuthState, initialStateAuth } from "./auth";
import dataTransfer, {
  DataTransferState,
  initialStateDataTransfer
} from "./dataTransfer";
import desktop, { DesktopState, initialStateDesktop } from "./desktop";
import explorer, { ExplorerState, initialStateExplorerState } from "./explorer";
import images, { ImagesState, initialStateImages } from "./images";
import searchPagination, {
  initialStateSearchPagination,
  SearchPaginationState
} from "./search-pagination";
import theme, { ThemeState } from "./theme";
import user, { initialStateUser, UserState } from "./user";
import webamp, { initialStateWebamp, WebampState } from "./webamp";
import windowsReducer, { initialStateWindows, WindowsState } from "./windows";
import settings, { initialSettingsState } from "./settings";

export const APPLY_SNAPSHOT = "APPLY_SNAPSHOT";

export interface AppState {
  explorer: ExplorerState;
  desktop: DesktopState;
  user: UserState;
  windows: WindowsState;
  images: ImagesState;
  auth: AuthState;
  searchPagination: SearchPaginationState;
  dataTransfer: DataTransferState;
  webamp: WebampState;
  theme: ThemeState;
  settings: SettingsState;
}

export const initialStateApp: AppState = {
  explorer: initialStateExplorerState,
  desktop: initialStateDesktop,
  user: initialStateUser,
  windows: initialStateWindows,
  images: initialStateImages,
  auth: initialStateAuth,
  searchPagination: initialStateSearchPagination,
  dataTransfer: initialStateDataTransfer,
  webamp: initialStateWebamp,
  theme: defaultTheme,
  settings: initialSettingsState
};

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows: windowsReducer,
  desktop,
  user,
  auth,
  searchPagination,
  dataTransfer,
  webamp,
  theme,
  settings
});

export default reducer;
