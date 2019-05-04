import { combineReducers } from "redux";
import desktop, { DesktopState } from "./desktop";
import explorer, { ExplorerState } from "./explorer";
import user, { UserState } from "./user";
import windows, { WindowsState } from "./windows";
import images, { ImagesState } from "./images";
import playback, { PlaybackState } from "./playback";

export interface AppState {
  explorer: ExplorerState;
  desktop: DesktopState;
  user: UserState;
  windows: WindowsState;
  images: ImagesState;
  playback: PlaybackState;
}

const reducer = combineReducers<AppState>({
  explorer,
  images,
  windows,
  desktop,
  user,
  playback
});

export default reducer;
