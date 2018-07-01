import React from "react";
import { connect } from "react-redux";
import {
  addTrackZeroAndPlay,
  viewTracksFromAlbum,
  viewAlbumsFromArtist,
  openImageModal
} from "../../actionCreators";
import { createFile, moveFile, selectFiles } from "./../../actions/desktop";
import File from "./File";
// import "../../../css/spotify-ui.css";

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: [] };
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
  }

  onDragStart(e, file) {
    e.dataTransfer.setData("oldFile", true);
    e.dataTransfer.setData("id", file.id);
    e.dataTransfer.setData("uri", file.uri);
    e.dataTransfer.setData("type", file.type);
    e.dataTransfer.setData("title", file.title);
    e.dataTransfer.setData("x", e.clientX - 50);
    e.dataTransfer.setData("y", e.clientY - 50);
  }

  onDrop(e) {
    e.preventDefault();
    const uri = e.dataTransfer.getData("uri");
    const id = e.dataTransfer.getData("id");
    const type = e.dataTransfer.getData("type");
    const title = e.dataTransfer.getData("title");
    const oldFile = e.dataTransfer.getData("oldFile");
    if (!oldFile) {
      this.props.createFile({
        uri,
        x: e.clientX - 50,
        y: e.clientY - 50,
        title,
        type
      });
    } else {
      this.props.moveFile({
        id,
        x: e.clientX - 50,
        y: e.clientY - 50
      });
    }
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

  doubleClickHandler(file) {
    if (file.type === "track") this.props.addTrackZeroAndPlay(file.uri);
    if (file.type === "album") this.props.viewTracksFromAlbum(file.uri);
    if (file.type === "artist") this.props.viewAlbumsFromArtist(file.uri);
    if (file.type === "image") this.props.openImage(file.uri);
  }

  onClick(file) {
    this.setState({ selected: [file.id] });
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
        {this.props.files.map(this.renderFile)}
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
  addTrackZeroAndPlay: track => dispatch(addTrackZeroAndPlay(track)),
  moveFile: file => dispatch(moveFile(file)),
  openImage: image => dispatch(openImageModal(image))
});

export default connect(mapStateToProps, mapDispatchToProps)(Desktop);
