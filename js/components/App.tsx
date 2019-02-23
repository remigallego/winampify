import React from "react";
import Explorer from "./Explorer";
import Desktop from "./Desktop";
import InfosBar from "./InfosBar";
import SelectionBox from "./SelectionBox";

interface State {
  selectionBox: {
    target: Array<number>;
    origin: Array<number>;
  };
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
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
          onSelect={(e: any, origin: any, target: any) =>
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
