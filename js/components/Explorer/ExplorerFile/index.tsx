import React, { ReactNode } from "react";
import { isPlaylistOwned } from "../../../selectors/user";
import { GenericFile, TrackFile } from "../../../types";
import { isPlaylist, isImage } from "../../../types/typecheckers";
import folderclosed from "../images/folder-closed.ico";
import winampmp3 from "../images/winamp-mp3.png";
import styles from "./styles";
import ImgCached from "../../Reusables/ImgCached";
const { itemStyle, fileName, iconWrapper, iconBig, iconSmall } = styles;

interface Props {
  file: GenericFile;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode;
  onDrag(e: React.DragEvent<HTMLDivElement>): void;
}

export default function(props: Props) {
  if (!props.file) return null;
  const { selected, onClick, onDoubleClick, children } = props;

  const renderIcons = (iconsArr: string[]) => {
    if (iconsArr.length > 1) {
      return (
        <div className="explorer-item-icon--wrapper" style={iconWrapper}>
          <img
            className="explorer-item-icon--bigger"
            src={iconsArr[0]}
            style={iconBig}
          />
          <ImgCached
            className="explorer-item-icon--smaller"
            src={iconsArr[1]}
            style={iconSmall}
            cachedSize={{ h: 20, w: 20 }}
          />
        </div>
      );
    }
    if (isImage(props.file)) {
      return (
        <div className="explorer-item-icon--wrapper" style={iconWrapper}>
          <ImgCached
            className="explorer-item-icon--bigger"
            src={iconsArr[0]}
            style={iconBig}
            cachedSize={{ h: 20, w: 20 }}
          />
        </div>
      );
    }
    return (
      <div className="explorer-item-icon--wrapper" style={iconWrapper}>
        <img
          className="explorer-item-icon--bigger"
          src={iconsArr[0]}
          style={iconBig}
        />
      </div>
    );
  };
  let thisStyle = { ...itemStyle };
  let thisClass = "explorer-item";
  const icons = [];

  const { metaData } = props.file;

  switch (metaData.type) {
    case "track":
      icons.push(winampmp3);
      break;
    case "playlist":
    case "album":
      icons.push(folderclosed);
      icons.push(metaData.images.length > 0 ? metaData.images[0].url : "");
      break;
    case "artist":
      icons.push(folderclosed);
      icons.push(metaData.images.length > 0 ? metaData.images[0].url : "");
      break;
    case "image":
      icons.push(metaData.url);
      break;
    default:
      break;
  }

  if (selected) {
    thisStyle = {
      ...itemStyle,
      backgroundColor: "#3064BD",
      color: "white",
      border: "1px solid white",
      borderStyle: "dotted"
    };
    thisClass = "explorer-item selected";
  }

  return (
    <div
      onMouseDown={onClick}
      onDoubleClick={onDoubleClick}
      style={thisStyle}
      className={thisClass}
      draggable={true}
      onDragStart={e => props.onDrag(e)}
      id={`file-${props.file.id}`}
    >
      {renderIcons(icons)}
      <div className="explorer-item-filename" style={fileName}>
        {children}
      </div>
    </div>
  );
}
