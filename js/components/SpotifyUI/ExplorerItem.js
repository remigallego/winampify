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
    if (this.props.type === "track") {
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
    e.dataTransfer.setData("id", this.id);
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
        id={this.props.key}
        className={thisClass}
        draggable="true"
        onDragStart={e => this.drag(e)}
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
