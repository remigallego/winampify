import "babel-polyfill";
import "../css/line-scale.css";
import React from "react";
import { render } from "react-dom";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import Winampify from "./components";

export const persistor = persistStore(store);

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Winampify />
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);
