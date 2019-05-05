import { combineReducers } from "redux";
import desktop, { DesktopState } from "./desktop";
import explorer, { ExplorerState } from "./explorer";
import user, { UserState } from "./user";
import windows, { WindowsState } from "./windows";
import images, { ImagesState } from "./images";
import playback, { PlaybackState } from "./playback";
import auth, { AuthState } from "./auth";

export interface AppState {
  explorer: ExplorerState;
  desktop: DesktopState;
  user: UserState;
  windows: WindowsState;
  images: ImagesState;
  playback: PlaybackState;
  auth: AuthState;
}

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows,
  desktop,
  user,
  playback,
  auth
});

export default reducer;
