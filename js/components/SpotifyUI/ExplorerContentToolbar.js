import React from "react";
import winampmp3 from "./images/winamp-mp3.png";
import folderclosed from "./images/folder-closed.ico";
import { ExplorerContentToolbarStyle } from "./styles";

const { container, info } = ExplorerContentToolbarStyle;

const ExplorerContentToolbar = props => {
  return (
    <div style={{ ...container }}>
      <div
        style={{
          ...info,
          width: Number(props.widths.name.slice(0, 3)) + 20 + "px"
        }}
      >
        Name
      </div>
      <div style={{ ...info, width: props.widths.length }}>Length</div>
      <div style={{ ...info, width: props.widths.genre }}>Genre</div>
      <div style={{ ...info, width: props.widths.date }}>Year</div>
    </div>
  );
};

export default ExplorerContentToolbar;
