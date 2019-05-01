import "babel-polyfill";
import "../css/line-scale.css";
import React from "react";
import { render } from "react-dom";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import * as WebampInstance from "../webamp/built/webamp.bundle";
import getStore from "./store";
import App from "./components/App";
import LandingPage from "./landingpage";
import SpotifyApiService from "./SpotifyApi/spotifyService";
import media from "./media";
import { PersistGate } from "redux-persist/integration/react";
import GenerateSpotifyMediaClass from "./SpotifyMediaClass";

// TODO: Workaround, need to figure out how to import webamp types
const Webamp: any = WebampInstance;

if (!Webamp.browserIsSupported()) {
  // eslint-disable-next-line
  alert("Oh no! Webamp does not work!");
  throw new Error("What's the point of anything?");
}

const defaultWindowsState = {
  genWindows: {
    equalizer: {
      open: false
    }
  }
};

const store = getStore(media);
const persistor = persistStore(store);
let tokens;

const url = window.location.search;
if (url !== "") {
  const getQuery = url.split("?")[1];
  const params = getQuery.split("&");
  if (params.length === 2)
    tokens = {
      // access_token= is 13 characters
      // refresh_token= is 14 characters
      accessToken: params[0].slice(13),
      refreshToken: params[1].slice(14)
    };
  else tokens = 0;
} else tokens = 0;

if (tokens) {
  const webamp = new Webamp(
    {
      handleTrackDropEvent: e => {
        if (e.dataTransfer.getData("tracks").length > 0) {
          const json = e.dataTransfer.getData("tracks");
          console.log(json);
          try {
            return JSON.parse(json);
          } catch (err) {}
        }
        return null;
      },
      __customMediaClass: GenerateSpotifyMediaClass(tokens),
      __initialState: { windows: defaultWindowsState }
      // Optional. The default skin is included in the js bundle, and will be loaded by default.
    },
    {}
  );

  // Render after the skin has loaded.
  webamp.renderWhenReady(document.getElementById("winamp-container"));
  SpotifyApiService.setAccessToken(tokens.accessToken);
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById("app")
  );
} else {
  render(<LandingPage />, document.getElementById("app"));
}
