import React from "react";
import { FaTimes } from "react-icons/fa";
import { dangerDark, dangerLight } from "../../../styles/themes";

interface Props {
  onClick: () => void | null;
}

interface State {
  backgroundColor: string;
}

class CloseIcon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      backgroundColor: "transparent"
    };
  }

  render() {
    return (
      <div
        className="close-icon"
        onClick={this.props.onClick}
        style={{
          color: "white",
          backgroundColor: this.state.backgroundColor,
          transition: "background-color 0.21s",
          zIndex: 555555
        }}
      >
        <FaTimes
          onMouseEnter={() =>
            this.setState({
              // color: greyMedium,
              backgroundColor: dangerLight
            })
          }
          onMouseLeave={() =>
            this.setState({
              backgroundColor: "transparent"
            })
          }
          onMouseDown={() =>
            this.setState({
              backgroundColor: dangerDark
            })
          }
          onMouseUp={() =>
            this.setState({
              backgroundColor: dangerLight
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

export default CloseIcon;
