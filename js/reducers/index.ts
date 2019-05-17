import { combineReducers } from "redux";
import auth, { AuthState } from "./auth";
import desktop, { DesktopState } from "./desktop";
import explorer, { ExplorerState } from "./explorer";
import images, { ImagesState } from "./images";
import playback, { PlaybackState } from "./playback";
import searchPagination, { SearchPaginationState } from "./search-pagination";
import user, { UserState } from "./user";
import windows, { WindowsState } from "./windows";

export interface AppState {
  explorer: ExplorerState;
  desktop: DesktopState;
  user: UserState;
  windows: WindowsState;
  images: ImagesState;
  playback: PlaybackState;
  auth: AuthState;
  searchPagination: SearchPaginationState;
}

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows,
  desktop,
  user,
  playback,
  auth,
  searchPagination
});

export default reducer;
