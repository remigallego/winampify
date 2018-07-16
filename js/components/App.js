import React from "react";
import PropTypes from "prop-types";
import Explorer from "./Explorer";
import "../../css/react-context-menu.css";
import "../../css/winamp.css";

import Desktop from "./Desktop";
import WinampApp from "./WinampApp";

const App = () => {
  return (
    <div role="application">
      <WinampApp />
      <Desktop />
      <Explorer />
    </div>
  );
};

App.propTypes = {
  container: PropTypes.instanceOf(Element)
};

export default App;
