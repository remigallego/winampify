import "babel-polyfill";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/line-scale.css";
import { authenticate } from "../actions/auth";
import { AppState } from "../reducers";
import { AuthState, LOADING } from "../reducers/auth";
import App from "./App";

export default () => {
  const dispatch = useDispatch();

  const auth = useSelector<AppState, AuthState>(state => state.auth);

  const listener = (event: MessageEvent) => {
    if (
      (event.data && typeof event.data === "string") ||
      event.data instanceof String
    )
      if (event.data.split(":").length === 2) {
        const tokens = event.data.split(":");
        window.removeEventListener("message", listener);
        dispatch(authenticate(tokens[0], tokens[1]));
      }
  };
  window.addEventListener("message", listener, false);

  const { loading, logged } = auth;
  return <App />;
};
