import React from "react";
import { ContextMenuProvider } from "react-contexify";
import folderclosed from "./images/folderclosed.png";
import bigWinampIcon from "./images/bigWinampIcon.png";
import { DesktopFileStyle } from "./styles";
import InputRenaming from "./InputRenaming";
import "./file.css";

const File = props => {
  const { file } = props;

  const getIcon = () => {
    switch (props.file.type) {
      case "track":
        return bigWinampIcon;
      case "album":
        return folderclosed;
      case "artist":
        return folderclosed;
      case "image":
        return props.file.uri;
      default:
        return bigWinampIcon;
    }
  };

  return (
    <ContextMenuProvider id={file.type}>
      <div
        className="file-fadeIn"
        style={{
          width: "100px",
          position: "absolute",
          left: file.x,
          top: file.y,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        id={file.id}
        onMouseDown={props.onClick}
        onDoubleClick={props.onDoubleClick}
      >
        <img src={getIcon()} style={DesktopFileStyle.image} />
        {file.renaming ? (
          <InputRenaming
            initialValue={file.title}
            confirmRenameFile={props.confirmRenameFile}
          />
        ) : (
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
        )}
      </div>
    </ContextMenuProvider>
  );
};

export default File;
