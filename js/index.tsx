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
import SpotifyApiService from "./SpotifyApi/api";
import { PersistGate } from "redux-persist/integration/react";
import SpotifyMediaClass from "./SpotifyMediaClass";
import { setTokens } from "./actions/user";

// TODO: Workaround, need to figure out how to import webamp types
const Webamp: any = WebampInstance;

if (!Webamp.browserIsSupported()) {
  // eslint-disable-next-line
  alert("Oh no! Webamp does not work!");
  throw new Error("What's the point of anything?");
}

const store = getStore();
const persistor = persistStore(store);
let accessToken;
let refreshToken;

const url = window.location.search;
if (url) {
  const getQuery = url.split("?")[1];
  const params = getQuery.split("&");
  if (params.length === 2) {
    accessToken = params[0].slice(13);
    refreshToken = params[1].slice(14);
  }
}
// Clean URL from query params
history.pushState(null, null, window.location.href.split("?")[0]);

if (accessToken && refreshToken) {
  SpotifyApiService.setAccessToken(accessToken);
  store.dispatch(setTokens(accessToken, refreshToken));
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
      __customMediaClass: SpotifyMediaClass
    },
    {}
  );

  // Render after the skin has loaded.
  webamp.renderWhenReady(document.getElementById("winamp-container"));
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
