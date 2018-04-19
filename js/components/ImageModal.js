import React from "react";

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
    width: "600px"
  };
  return (
    <div className="backdrop" onClick={props.onClick} style={backdropStyle}>
      <div className="close">Close</div>
      <img src={props.image} style={imageStyle} />
    </div>
  );
};

export default ImageModal;
