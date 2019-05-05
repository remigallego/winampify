import { FaTimes } from "react-icons/fa";
import React from "react";
import { greyLight, greyDark } from "../../../colors";

interface Props {
  src: string;
  onClick: () => void | null;
}

interface State {
  color: string;
}

class Icon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      color: greyLight
    };
  }

  render() {
    return (
      <div
        className="icon"
        onClick={this.props.onClick}
        style={{
          color: this.state.color
        }}
      >
        <FaTimes
          onMouseDown={() =>
            this.setState({
              color: greyDark
            })
          }
          onMouseUp={() =>
            this.setState({
              color: greyLight
            })
          }
          id="disallow-on-top"
          style={{ cursor: "pointer" }}
          size={20}
        />
      </div>
    );
  }
}

export default Icon;
