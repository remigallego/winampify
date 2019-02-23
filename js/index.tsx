import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import * as WebampInstance from "../webamp/built/webamp.bundle";
import getStore from "./store";
import App from "./components/App";
import LandingPage from "./landingpage";
import SpotifyApiService from "./SpotifyApiService";
import media from "./media";
import { PersistGate } from "redux-persist/integration/react";

// TODO: Workaround, need to figure out how to import webamp types
const Webamp: any = WebampInstance;

if (!Webamp.browserIsSupported()) {
  // eslint-disable-next-line
  alert("Oh no! Webamp does not work!");
  throw new Error("What's the point of anything?");
}

const webamp = new Webamp(
  {
    initialTracks: [
      {
        metaData: {
          artist: "DJ Mike Llama",
          title: "Llama Whippin' Intro"
        },
        // Can be downloaded from: https://github.com/captbaritone/webamp/raw/master/mp3/llama-2.91.mp3
        url: "path/to/mp3/llama-2.91.mp3"
      }
    ],
    handleTrackDropEvent: e => {
      return new Promise((resolve, reject) => {
        if (e.dataTransfer.getData("tracks").length > 0) {
          try {
            resolve(JSON.parse(e.dataTransfer.getData("tracks")));
          } catch (err) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    }
    // Optional. The default skin is included in the js bundle, and will be loaded by default.
  },
  {}
);

// Render after the skin has loaded.
webamp.renderWhenReady(document.getElementById("winamp-container"));

const store = getStore(media, null);
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
