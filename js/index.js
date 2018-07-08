import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import base from "../skins/base-2.91.wsz";
import osx from "../skins/MacOSXAqua1-5.wsz";
import topaz from "../skins/TopazAmp1-2.wsz";
import visor from "../skins/Vizor1-01.wsz";
import xmms from "../skins/XMMS-Turquoise.wsz";
import zaxon from "../skins/ZaxonRemake1-0.wsz";
import green from "../skins/Green-Dimension-V2.wsz";
import Winamp from "./winamp";
import Loading from "./loading";
import LandingPage from "./landingpage";

import { hideAbout, skinUrl, initialState } from "./config";

if (hideAbout) {
  document.getElementsByClassName("about")[0].style.visibility = "hidden";
}
if (!Winamp.browserIsSupported()) {
  document.getElementById("browser-compatibility").style.display = "block";
  document.getElementById("app").style.visibility = "hidden";
}

let tokens;

const url = window.location.search;
if (url !== "") {
  const getQuery = url.split("?")[1];
  const params = getQuery.split("&");
  if (params.length === 2)
    tokens = {
      accessToken: params[0].slice(2),
      refreshToken: params[1].slice(2)
    };
  else tokens = 0;
} else tokens = 0;

if (tokens) {
  const winamp = new Winamp({
    initialSkin: {
      url: skinUrl
    },
    tokens: tokens,
    avaliableSkins: [
      { url: base, name: "<Base Skin>" },
      { url: green, name: "Green Dimension V2" },
      { url: osx, name: "Mac OSX v1.5 (Aqua)" },
      { url: topaz, name: "TopazAmp" },
      { url: visor, name: "Vizor" },
      { url: xmms, name: "XMMS Turquoise " },
      { url: zaxon, name: "Zaxon Remake" }
    ],
    enableHotkeys: false,
    __initialState: initialState
  });
  render(<Loading />, document.getElementById("app"));
  winamp.renderWhenReady(document.getElementById("app"), tokens);
} else {
  render(<LandingPage />, document.getElementById("app"));
}
