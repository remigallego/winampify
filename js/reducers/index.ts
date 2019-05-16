import { combineReducers } from "redux";
import auth, { AuthState } from "./auth";
import desktop, { DesktopState } from "./desktop";
import explorer, { ExplorerState } from "./explorer";
import images, { ImagesState } from "./images";
import playback, { PlaybackState } from "./playback";
import search, { SearchState } from "./search";
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
  search: SearchState;
}

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows,
  desktop,
  user,
  playback,
  auth,
  search
});

export default reducer;
