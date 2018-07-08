import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import getStore from "./store";
import App from "./components/App";
import Hotkeys from "./hotkeys";
import Media from "./media";
import { setSkinFromUrl, createPlayerObject } from "./actionCreators";
import {
  SET_AVALIABLE_SKINS,
  NETWORK_CONNECTED,
  NETWORK_DISCONNECTED
} from "./actionTypes";
import { PersistGate } from "redux-persist/integration/react";

// Return a promise that resolves when the store matches a predicate.
const storeHas = (store, predicate) =>
  new Promise(resolve => {
    if (predicate(store.getState())) {
      resolve();
      return;
    }
    const unsubscribe = store.subscribe(() => {
      if (predicate(store.getState())) {
        resolve();
        unsubscribe();
      }
    });
  });

// The Spotify player needs to be loaded from an external script,
//   thus we need a promise function to keep track of it
function loadScriptAsync(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", e => reject(e));
    document.body.appendChild(script);
  });
}

class Winamp {
  static browserIsSupported() {
    const supportsAudioApi = !!(
      window.AudioContext || window.webkitAudioContext
    );
    const supportsCanvas = !!window.document.createElement("canvas").getContext;
    const supportsPromises = typeof Promise !== "undefined";
    return supportsAudioApi && supportsCanvas && supportsPromises;
  }

  constructor(options) {
    this.options = options;
    const { avaliableSkins, enableHotkeys = false } = this.options;

    loadScriptAsync("https://sdk.scdn.co/spotify-player.js")
      .then(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          // eslint-disable-next-line
          const player = new Spotify.Player({
            name: "Winampify",
            getOAuthToken: cb => {
              cb(this.options.tokens.accessToken);
            }
          });
          player.accessToken = this.options.tokens.accessToken;
          player.refreshToken = this.options.tokens.refreshToken;

          player.addListener("initialization_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("account_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("playback_error", ({ message }) => {
            console.error(message);
          });

          // Playback status updates

          // Ready
          // eslint-disable-next-line
          player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            this.store.dispatch(createPlayerObject(player));
          });

          // Connect to the player!
          player.connect();
        };
      })
      .catch(e => {
        console.error(e);
      });

    this.media = new Media();
    this.store = getStore(this.media, this.options.__initialState);
    this.persistor = persistStore(this.store);
    this.store.dispatch({
      type: navigator.onLine ? NETWORK_CONNECTED : NETWORK_DISCONNECTED
    });

    window.addEventListener("online", () =>
      this.store.dispatch({ type: NETWORK_CONNECTED })
    );
    window.addEventListener("offline", () =>
      this.store.dispatch({ type: NETWORK_DISCONNECTED })
    );

    this.store.dispatch(setSkinFromUrl(this.options.initialSkin.url));

    if (avaliableSkins) {
      this.store.dispatch({
        type: SET_AVALIABLE_SKINS,
        skins: avaliableSkins
      });
    }
  }

  async renderWhenReady(node) {
    // Wait for the skin to load.
    await storeHas(this.store, state => !state.display.loading);

    render(
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          <App
            container={this.options.container}
            filePickers={this.options.filePickers}
          />
        </PersistGate>
      </Provider>,
      node
    );
  }
}

export default Winamp;
module.exports = Winamp;
