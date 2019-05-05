import { FaTimes } from "react-icons/fa";
import React from "react";
import { greyLight, greyDark, greyMedium } from "../../../colors";

interface Props {
  src: string;
  onClick: () => void | null;
}

interface State {
  color: string;
  scale: number;
}

class Icon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      color: greyLight,
      scale: 1
    };
  }

  render() {
    return (
      <div
        className="icon"
        onClick={this.props.onClick}
        style={{
          color: this.state.color,
          transform: `scale(${this.state.scale})`
        }}
      >
        <FaTimes
          onMouseEnter={() =>
            this.setState({
              color: greyMedium
            })
          }
          onMouseLeave={() =>
            this.setState({
              color: greyLight
            })
          }
          onMouseDown={() =>
            this.setState({
              color: greyDark,
              scale: 0.8
            })
          }
          onMouseUp={() =>
            this.setState({
              color: greyLight,
              scale: 1
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
