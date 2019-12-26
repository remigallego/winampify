import React from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "../../actions/theme";
import { SET_ACCESS_TOKEN } from "../../reducers/auth";
import { APPLY_SNAPSHOT, initialStateApp } from "../../reducers/index";
import store from "../../store";
import { darkTheme, defaultTheme } from "../../styles/themes";
import snapshotOne from "./0.2.2/desktop-files.json";
import reset from "./0.2.2/reset-state.json";
import snapshotTwo from "./0.2.2/snapshotTwo.json";

const DeveloperPanel = () => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        height: 100,
        width: "100%",
        backgroundColor: "black",
        opacity: 0.7
      }}
    >
      <button
        onClick={() => {
          dispatch(setTheme(defaultTheme));
        }}
      >
        Light mode
      </button>
      <button
        onClick={() => {
          dispatch(setTheme(darkTheme));
        }}
      >
        Dark mode
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: APPLY_SNAPSHOT,
            payload: { snapshot: { ...snapshotOne } }
          })
        }
      >
        Snapshot 1
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: APPLY_SNAPSHOT,
            payload: { snapshot: { ...snapshotTwo } }
          })
        }
      >
        Snapshot 2
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: APPLY_SNAPSHOT,
            payload: { snapshot: { ...reset } }
          })
        }
      >
        Reset state
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: SET_ACCESS_TOKEN,
            payload: {
              accessToken: "xxxxxxx"
            }
          })
        }
      >
        Poison access token
      </button>
    </div>
  );
};

export default DeveloperPanel;
