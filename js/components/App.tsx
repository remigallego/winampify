import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Desktop from "./Desktop";
import DeveloperPanel from "./DeveloperPanel";
import SelectionBox from "./Reusables/SelectionBox";
import WindowsManager from "./WindowsManager";

export default () => {
  const [selectionBox, setSelectionBox] = useState({
    origin: { x: 0, y: 0 },
    target: { x: 0, y: 0 }
  });

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
        {process.env.NODE_ENV === "development" && <DeveloperPanel />}
      </SelectionBox>
    </div>
  );
};
