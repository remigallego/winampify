import React from "react";
import PropTypes from "prop-types";
import Explorer from "./Explorer";
import "../../css/react-context-menu.css";
import "../../css/winamp.css";
import Desktop from "./Desktop";
import InfosBar from "./InfosBar";
import SelectionBox from "./SelectionBox";

import Test from "./Test";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionBox: { target: [0, 0], origin: [0, 0] }
    };
  }
  render() {
    return (
      <div>
        <SelectionBox
          selectZoneId={"selectzone"}
          onSelect={(e, origin, target) =>
            this.setState({ selectionBox: { target, origin } })
          }
        >
          <InfosBar />
          <Desktop selectionBox={this.state.selectionBox} />
          <Explorer />
        </SelectionBox>
      </div>
    );
  }
}

export default App;
