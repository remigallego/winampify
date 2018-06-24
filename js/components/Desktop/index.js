import React from "react";
import { connect } from "react-redux";
import {
  addTrackZeroAndPlay,
  viewTracksFromAlbum,
  viewAlbumsFromArtist,
  playTrack
} from "../../actionCreators";
import { createFile, selectFiles } from "./../../actions/desktop";
import File from "./File";
// import "../../../css/spotify-ui.css";

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: [] };
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
  }
  onDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const type = e.dataTransfer.getData("type");
    const title = e.dataTransfer.getData("title");
    this.props.createFile({
      id,
      x: e.clientX - 50,
      y: e.clientY - 50,
      title,
      type
    });
  }
  renderFiles() {
    return this.props.files.map(this.renderFile);
  }
  doubleClickHandler(file) {
    if (file.type === "track") this.props.addTrackZeroAndPlay(file.id);
    if (file.type === "album") this.props.viewTracksFromAlbum(file.id);
    if (file.type === "artist") this.props.viewAlbumsFromArtist(file.id);
  }
  onClick(file) {
    const selected = this.state.selected;
    selected.push(file.id);
    this.setState({ selected });
  }
  componentDidMount() {
    document.addEventListener(
      "dragstart",
      e => {
        const dragIcon = document.createElement("img");
        dragIcon.src = "./images/winamp-mp3.png";
        dragIcon.width = 500;
        e.dataTransfer.setDragImage(dragIcon, 10, -10);
      },
      false
    );
  }
  onDragStart(e, file) {
    console.log("dragging!!!!");
    e.dataTransfer.setData("id", file.id);
    e.dataTransfer.setData("type", file.type);
    e.dataTransfer.setData("title", file.title);
    e.dataTransfer.setData("x", e.clientX - 50);
    e.dataTransfer.setData("y", e.clientY - 50);
  }
  renderFile(file) {
    return (
      <div draggable onDragStart={e => this.onDragStart(e, file)}>
        <File
          file={file}
          selected={this.state.selected.indexOf(file.id) !== -1}
          onClick={() => this.onClick(file)}
          onDoubleClick={() => this.doubleClickHandler(file)}
        />
      </div>
    );
  }
  render() {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          zIndex: "-777"
        }}
        id="dropzone"
        onDrop={e => this.onDrop(e)}
        onDragOver={e => {
          e.preventDefault();
        }}
        onClick={e => {
          if (e.target.id === "dropzone") this.setState({ selected: [] });
        }}
      >
        {this.renderFiles()}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  desktop: state.desktop,
  files: selectFiles(state)
});

const mapDispatchToProps = dispatch => ({
  createFile: file => {
    dispatch(createFile(file));
  },
  viewTracksFromAlbum: album => dispatch(viewTracksFromAlbum(album)),
  viewAlbumsFromArtist: artist => dispatch(viewAlbumsFromArtist(artist)),
  addTrackZeroAndPlay: track => dispatch(addTrackZeroAndPlay(track))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Desktop);
