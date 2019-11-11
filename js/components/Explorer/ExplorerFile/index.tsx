import React from "react";
import { GenericFile } from "../../../types";
import folderclosed from "../images/folder-closed.ico";
import winampmp3 from "../images/winamp-mp3.png";
import styles from "./styles";

const { itemStyle, fileName, iconWrapper, iconBig, iconSmall } = styles;

interface Props {
  file: GenericFile;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDrag(e: React.DragEvent<HTMLDivElement>): void;
}

class ExplorerFile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  /*
  getDuration() {
    const seconds = `0${Math.floor(
      (this.props.file.metaData.duration_ms / 1000) % 60
    )}`.slice(-2);
    const minutes = Math.floor(
      (this.props.file.metaData.duration_ms / (60 * 1000)) % 60
    );
    return `${minutes}:${seconds}`;
  }

  getGenre() {
    const genreArray = this.props.file.metaData.genres;
    return genreArray.length > 0 ? genreArray[0] : "";
  }

  getDate() {
    const { releaseDate } = this.props;
    const rgx = /-/gi;
    const date = releaseDate.replace(rgx, "/");
    return date;
  }
  */

  renderIcons(icons: string[]) {
    if (icons.length > 1) {
      return (
        <div className="explorer-item-icon--wrapper" style={iconWrapper}>
          <img
            className="explorer-item-icon--bigger"
            src={icons[0]}
            style={iconBig}
          />
          <img
            className="explorer-item-icon--smaller"
            src={icons[1]}
            style={iconSmall}
          />
        </div>
      );
    }
    return (
      <div className="explorer-item-icon--wrapper" style={iconWrapper}>
        <img
          className="explorer-item-icon--bigger"
          src={icons[0]}
          style={iconBig}
        />
      </div>
    );
  }

  render() {
    if (!this.props.file) return null;
    const { selected, onClick, onDoubleClick, children } = this.props;

    let thisStyle = { ...itemStyle };
    let thisClass = "explorer-item";
    const icons = [];

    const { metaData } = this.props.file;

    switch (metaData.type) {
      case "track":
        // case "playlist":
        icons.push(winampmp3);
        break;
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
        borderStyle: "dotted",
        boxSizing: "border-box"
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
        onDragStart={e => this.props.onDrag(e)}
        id={`file-${this.props.file.id}`}
      >
        {this.renderIcons(icons)}
        <div className="explorer-item-filename" style={fileName}>
          {children}
        </div>
      </div>
    );
  }
}

export default ExplorerFile;
