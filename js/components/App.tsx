import React from "react";
import ReactGA from "react-ga";
import Desktop from "./Desktop";
import DeveloperPanel from "./DeveloperPanel";
import SelectionBox from "./Reusables/SelectionBox";
import WindowsManager from "./WindowsManager";
// import AudioPlayer from "./AudioPlayer";

interface State {
  selectionBox: {
    target: number[];
    origin: number[];
  };
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectionBox: { target: [0, 0], origin: [0, 0] }
    };
  }

  componentDidMount() {
    ReactGA.pageview("/app");
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
          <Desktop selectionBox={this.state.selectionBox} />
          <WindowsManager />
          {process.env.NODE_ENV === "development" && <DeveloperPanel />}
        </SelectionBox>
      </div>
    );
  }
}

export default App;
