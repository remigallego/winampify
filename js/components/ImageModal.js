import React from "react";
import Draggable from "react-draggable";

const ImageModal = props => {
  const backdropStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.5)",
    width: "100%",
    height: "100%"
  };

  const imageStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    resize: "both",
    overflow: "auto"
  };
  return (
    <Draggable onMouseDown={e => e.preventDefault()}>
      <div style={imageStyle}>
        <div
          style={{
            width: "100%",
            height: 20,
            backgroundColor: "#0F6CE5",
            display: "flex",
            flexDirection: "row-reverse"
          }}
        >
          <div
            style={{ color: "white", paddingRight: 5 }}
            onClick={props.onClick}
          >
            X
          </div>
        </div>
        <img
          draggable={false}
          src={props.image}
          className={"unselectable-image"}
          onMouseDown={e => e.preventDefault()}
          height={400}
          width={400}
        />
      </div>
    </Draggable>
  );
};

export default ImageModal;
