import skin from "../skins/base-2.91.wsz";

const { hash } = window.location;
let config = {};
if (hash) {
  console.log(hash);
  try {
    config = JSON.parse(decodeURIComponent(hash).slice(1));
  } catch (e) {
    console.error("Failed to decode config from hash: ", hash);
  }
}

// Backwards compatibility with the old syntax
if (config.audioUrl && !config.initialTracks) {
  config.initialTracks = [{ url: config.audioUrl }];
}

// Turn on the incomplete playlist window
export const skinUrl = config.skinUrl === undefined ? skin : config.skinUrl;

export const hideAbout = config.hideAbout || false;
export const initialState = config.initialState || undefined;
