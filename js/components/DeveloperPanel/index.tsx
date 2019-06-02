import React from "react";
import { APPLY_SNAPSHOT, initialStateApp } from "../../reducers/index";
import store from "../../store";
import snapshotOne from "./0.2.2/desktop-files.json";
import reset from "./0.2.2/reset-state.json";
import snapshotTwo from "./0.2.2/snapshotTwo.json";
import { THEMES } from "../../styles/themes";
import { APPLY_THEME } from "../../reducers/settings";

const DeveloperPanel = () => {
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
          console.log(JSON.stringify(store.getState()));
        }}
      >
        Print state to console
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
            type: APPLY_THEME,
            payload: { theme: THEMES.DEFAULT }
          })
        }
      >
        Default Theme
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: APPLY_THEME,
            payload: { theme: THEMES.DARK }
          })
        }
      >
        Dark Theme
      </button>
    </div>
  );
};

export default DeveloperPanel;
