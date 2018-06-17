import React from "react";
import folderclosed from "./images/folderclosed.png";
import bigWinampIcon from "./images/bigWinampIcon.png";
import { DesktopFileStyle } from "./styles";
const File = props => {
  const { file } = props;

  const getIcon = () => {
    switch (props.file.type) {
      case "track":
        return bigWinampIcon;
      case "album":
        return folderclosed; //;
      case "artist":
        return folderclosed; //
      default:
        return bigWinampIcon;
    }
  };
  return (
    <div
      style={{
        width: "100px",
        height: "auto",
        position: "absolute",
        left: file.x,
        top: file.y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
      onMouseDown={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onClick={props.onClick}
      draggable={"true"}
      onDragStart={props.onDragStart}
    >
      <img src={getIcon()} style={DesktopFileStyle.image} />
      <div
        style={{
          ...DesktopFileStyle.fileName,
          backgroundColor: props.selected ? "#3064BD" : "transparent",
          border: props.selected
            ? "1px dotted white"
            : "1px dotted transparent",
          borderStyle: "dotted",
          boxSizing: "border-box"
        }}
      >
        {file.title}
      </div>
    </div>
  );
};

export default File;
