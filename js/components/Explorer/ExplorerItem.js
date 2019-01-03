import { isArray } from "util";
import React from "react";
import winampmp3 from "./images/winamp-mp3.png";
import folderclosed from "./images/folder-closed.ico";
import { ExplorerItemStyle } from "./styles";

const {
  itemStyle,
  fileName,
  iconWrapper,
  iconBig,
  iconSmall
} = ExplorerItemStyle;

class ExplorerItem extends React.Component {
  constructor(props) {
    super(props);
    this.id = null;
  }
  componentDidMount() {
    if (this.props.infos) {
      this.id = this.props.infos.id;
    }
  }

  getDuration() {
    const seconds = `0${Math.floor(
      (this.props.infos.duration_ms / 1000) % 60
    )}`.slice(-2);
    const minutes = Math.floor(
      (this.props.infos.duration_ms / (60 * 1000)) % 60
    );
    return `${minutes}:${seconds}`;
  }

  getGenre() {
    const genreArray = this.props.artist.genres;
    return genreArray.length > 0 ? genreArray[0] : "";
  }

  getDate() {
    const { releaseDate } = this.props;
    const rgx = /-/gi;
    const date = releaseDate.replace(rgx, "/");
    return date;
  }

  renderIcons(icons) {
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

  drag(e) {
    console.log(this.props.infos);
    const emptyImage = document.createElement("img");
    emptyImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    /*  if (this.props.type === "image") {
      e.dataTransfer.setData("uri", this.props.image);
    } else e.dataTransfer.setData("uri", this.id); */

    const children = isArray(this.props.children)
      ? this.props.children.join("")
      : this.props.children;

    const file = {
      id: this.id,
      type: this.props.type,
      title: children,
      uri: this.props.type === "image" ? this.props.image : this.id
    };

    // TODO: Will make sense when scaling to multi-dragging
    e.dataTransfer.setData("files", JSON.stringify([file]));
  }
  render() {
    const {
      artist,
      type,
      selected,
      onClick,
      onDoubleClick,
      children
    } = this.props;

    let thisStyle = { ...itemStyle };
    let thisClass = "explorer-item";
    const icons = [];

    switch (type) {
      case "track":
      case "playlist":
        icons.push(winampmp3);
        break;
      case "album":
        icons.push(folderclosed);
        icons.push(this.props.image);
        break;
      case "artist":
        icons.push(folderclosed);
        icons.push(artist.images.length > 0 ? artist.images[0].url : "");
        break;
      case "image":
        icons.push(this.props.image);
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
        draggable="true"
        onDragStart={e => this.drag(e)}
        id={"explorer-item"}
      >
        {this.renderIcons(icons)}
        <div className="explorer-item-filename" style={fileName}>
          {children}
        </div>
      </div>
    );
  }
}

export default ExplorerItem;
