import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import Webamp from "../webamp/built/webamp.bundle";
import getStore from "../js/store";
import App from "./components/App";
// import Loading from "./loading";
import LandingPage from "./landingpage";
import SpotifyApiService from "./SpotifyApiService";
import media from "./media";
import { PersistGate } from "redux-persist/integration/react";

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
      console.log(e);
      if (e.dataTransfer.getData("tracks").length > 0) {
        try {
          return JSON.parse(e.dataTransfer.getData("tracks"));
        } catch (err) {
          alert("Error parsing track");
        }
      }
    }
    // Optional. The default skin is included in the js bundle, and will be loaded by default.
  },
  {}
);

console.log(webamp);
// Render after the skin has loaded.
webamp.renderWhenReady(document.getElementById("winamp-container"));

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
  SpotifyApiService.setAccessToken(tokens.accessToken);
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App
        // container={this.options.container}
        // filePickers={this.options.filePickers}
        />
      </PersistGate>
    </Provider>,
    document.getElementById("app")
  );
  // winamp.renderWhenReady(document.getElementById("app"), tokens);
} else {
  render(<LandingPage />, document.getElementById("app"));
}
