import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { AppState } from "../reducers";
import Desktop from "./Desktop";
import DeveloperPanel from "./DeveloperPanel";
import SelectionBox from "./Reusables/SelectionBox";
import Settings from "./Settings";
import Webamp from "./Webamp";
import WindowsManager from "./WindowsManager";

export default () => {
  const [selectionBox, setSelectionBox] = useState({
    origin: { x: 0, y: 0 },
    target: { x: 0, y: 0 }
  });

  const settingsMenu = useSelector(
    (state: AppState) => state.settings.showSettings
  );

  useEffect(() => {
    ReactGA.pageview("/app");
  }, []);

  const GlobalStyle = createGlobalStyle`
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
      }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: ${props => props.theme.explorer.scroll};
      box-shadow: 0 0 1px rgba(255,255,255,.5);
      }
  `;

  return (
    <div>
      <SelectionBox
        selectZoneId={"selectzone"}
        onSelect={(origin, target) => setSelectionBox({ origin, target })}
      >
        {settingsMenu && <Settings />}
        <GlobalStyle></GlobalStyle>
        <Desktop selectionBox={selectionBox} />
        <WindowsManager />
        <Webamp />
        {process.env.NODE_ENV === "development" && <DeveloperPanel />}
      </SelectionBox>
    </div>
  );
};
