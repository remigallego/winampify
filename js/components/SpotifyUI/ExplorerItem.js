import React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import winampmp3 from "./images/winamp-mp3.png";
import folderclosed from "./images/folder-closed.ico";
import { DragSource } from "react-dnd";

class ExplorerItem extends React.Component {
  componentDidMount() {}
  renderIcons(icons) {
    if (icons.length > 1) {
      return (
        <div className="explorer-item-icon--wrapper">
          <img className="explorer-item-icon--bigger" src={icons[0]} />
          <img className="explorer-item-icon--smaller" src={icons[1]} />
        </div>
      );
    }
    return (
      <div className="explorer-item-icon--wrapper">
        <img className="explorer-item-icon--bigger" src={icons[0]} />
      </div>
    );
  }

  render() {
    const {
      type,
      selected,
      onClick,
      onDoubleClick,
      children,
      image
    } = this.props;
    let thisclass = "explorer-item";
    const icons = [];

    switch (type) {
      case "track":
      case "playlist":
        icons.push(winampmp3);
        break;
      case "album":
        icons.push(folderclosed);
        icons.push(image);
        break;
      case "artist":
        icons.push(folderclosed);
        icons.push(image);
        break;
      case "image":
        icons.push(image);
        break;
      default:
        break;
    }

    if (selected) thisclass = `${thisclass} +  explorer-selected`;
    let duration = "";
    if (type === "track") {
      const seconds = `0${Math.floor(
        (this.props.infos.duration_ms / 1000) % 60
      )}`.slice(-2);
      const minutes = Math.floor(
        (this.props.infos.duration_ms / (60 * 1000)) % 60
      );
      duration = `${minutes}:${seconds}`;
    }

    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div
        onClick={onClick}
        onMouseDown={onClick}
        onDoubleClick={onDoubleClick}
        className={thisclass}
        style={{
          opacity: isDragging ? 0.7 : 1
        }}
      >
        {this.renderIcons(icons)}
        <div className="explorer-item-filename">{children}</div>
        <div className="explorer-item-length">{duration}</div>
      </div>
    );
  }
}

const trackSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}
export const ItemTypes = {
  TRACK: "track"
};

export default DragSource(ItemTypes.TRACK, trackSource, collect)(ExplorerItem);
