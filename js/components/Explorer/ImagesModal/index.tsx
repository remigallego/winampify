import React from "react";
import Draggable from "react-draggable";
import "./ImageAnimation.css";
import { Image } from "../../../types";

interface Props {
  image: Image;
  key: string;
  onDismiss: () => void;
}

interface State {
  animation: string;
}

class ImagesModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { animation: "" };
  }

  componentWillMount() {
    this.setState({ animation: "growing-animation" }, () =>
      setTimeout(() => this.setState({ animation: "" }), 250)
    );
  }

  render() {
    return (
      <>
        <Draggable
          onMouseDown={e => e.preventDefault()}
          key={this.props.key}
          defaultPosition={{
            x: this.props.image.x - 200,
            y: this.props.image.y - 200
          }}
        >
          <div
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              width: "400px",
              resize: "both",
              overflow: "auto",
              "box-shadow":
                this.state.animation.length === 0
                  ? "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                  : ""
            }}
          >
            <div className={this.state.animation}>
              <div
                style={{
                  width: "100%",
                  height: 20,
                  backgroundColor: "rgba(15, 108, 229, 0.9)",
                  display: "flex",
                  flexDirection: "row-reverse"
                }}
              >
                <div
                  style={{ color: "white", paddingRight: 5 }}
                  onClick={() => {
                    this.setState({ animation: "shrink-animation" }, () =>
                      setTimeout(() => this.props.onDismiss(), 250)
                    );
                  }}
                >
                  X
                </div>
              </div>
              <img
                draggable={false}
                src={this.props.image.source}
                className={"unselectable-image"}
                onMouseDown={e => e.preventDefault()}
                height={400}
                width={400}
              />
            </div>
          </div>
        </Draggable>
      </>
    );
  }
}
export default ImagesModal;
