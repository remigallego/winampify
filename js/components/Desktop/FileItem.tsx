import React from "react";
import { ContextMenuProvider } from "react-contexify";
import folderclosed from "./images/folderclosed.png";
import bigWinampIcon from "./images/bigWinampIcon.png";
import { DesktopFileStyle } from "./styles";
import InputRenaming from "./InputRenaming";
import "./file.css";
import { File, GenericFile } from "../../types";

interface Props {
  file: GenericFile;
  onClick?: (e: any) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  confirmRenameFile: (e: any) => void;
  selected: boolean;
}

const FileItem = (props: Props) => {
  const { file } = props;

  const getIcon = () => {
    switch (file.metaData.type) {
      case "track":
        return bigWinampIcon;
      case "album":
        return folderclosed;
      case "artist":
        return folderclosed;
      case "image":
        return file.uri;
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
        {file.isRenaming ? (
          <InputRenaming
            initialValue={file.title}
            confirmRenameFile={props.confirmRenameFile}
          />
        ) : (
          <div
            style={{
              fontSize: "14px",
              textAlign: "center",
              color: "white",
              textShadow: "1px 1px black",
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

export default FileItem;
