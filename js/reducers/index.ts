import { combineReducers } from "redux";
import auth, { AuthState, initialStateAuth } from "./auth";
import desktop, { DesktopState, initialStateDesktop } from "./desktop";
import explorer, { ExplorerState, initialStateExplorerState } from "./explorer";
import images, { ImagesState, initialStateImages } from "./images";
import playback, { initialStatePlayback, PlaybackState } from "./playback";
import searchPagination, {
  initialStateSearchPagination,
  SearchPaginationState
} from "./search-pagination";
import settings, { initialStateSettings, SettingsState } from "./settings";
import user, { initialStateUser, UserState } from "./user";
import windows, { initialStateWindows, WindowsState } from "./windows";

export const APPLY_SNAPSHOT = "APPLY_SNAPSHOT";

export interface AppState {
  explorer: ExplorerState;
  desktop: DesktopState;
  user: UserState;
  windows: WindowsState;
  images: ImagesState;
  playback: PlaybackState;
  auth: AuthState;
  searchPagination: SearchPaginationState;
  settings: SettingsState;
}

export const initialStateApp: AppState = {
  explorer: initialStateExplorerState,
  desktop: initialStateDesktop,
  user: initialStateUser,
  windows: initialStateWindows,
  images: initialStateImages,
  playback: initialStatePlayback,
  auth: initialStateAuth,
  searchPagination: initialStateSearchPagination,
  settings: initialStateSettings
};

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows,
  desktop,
  user,
  playback,
  auth,
  searchPagination,
  settings
});

export default reducer;
