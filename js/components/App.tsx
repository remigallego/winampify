import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Desktop from "./Desktop";
import DeveloperPanel from "./DeveloperPanel";
import SelectionBox from "./Reusables/SelectionBox";
import WindowsManager from "./WindowsManager";
import { useDispatch } from "react-redux";
import { setWebampInstance } from "../actions/webamp";
import Webamp from "./Webamp";

export default () => {
  const [selectionBox, setSelectionBox] = useState({
    origin: { x: 0, y: 0 },
    target: { x: 0, y: 0 }
  });

  useDispatch()(setWebampInstance());

  useEffect(() => {
    ReactGA.pageview("/app");
  }, []);

  return (
    <div>
      <SelectionBox
        selectZoneId={"selectzone"}
        onSelect={(origin, target) => setSelectionBox({ origin, target })}
      >
        <Desktop selectionBox={selectionBox} />
        <WindowsManager />
        <Webamp />
        {process.env.NODE_ENV === "development" && <DeveloperPanel />}
      </SelectionBox>
    </div>
  );
};
