import React from "react";
import { connect } from "react-redux";
import {
  addTrackZeroAndPlay,
  viewTracksFromAlbum,
  viewAlbumsFromArtist,
  openImageModal
} from "../../actionCreators";
import {
  createFile,
  moveFile,
  selectFiles,
  renameFile,
  confirmRenameFile,
  cancelRenaming,
  deleteFile
} from "./../../actions/desktop";
import File from "./File";
// import "../../../css/spotify-ui.css";

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: [] };
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
  }

  componentWillMount() {
    addEventListener("contextmenu", e => {
      e.preventDefault();
      console.log(e.target);
    });
    addEventListener("keydown", e => {
      e.preventDefault();
      if (e.keyCode === 46) {
        this.state.selected.map(fileId => this.props.deleteFile(fileId));
      }
    });
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
      <div
        draggable={!file.renaming}
        onDragStart={e => this.onDragStart(e, file)}
      >
        <File
          file={file}
          selected={this.state.selected.indexOf(file.id) !== -1}
          onClick={e => this.onClick(file, e)}
          onDoubleClick={() => this.doubleClickHandler(file)}
          confirmRenameFile={e => {
            e.preventDefault();
            if (e.target[0].value.length === 0) {
              return;
            }
            this.props.confirmRenameFile(file, e.target[0].value);
          }}
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

  onClick(file, e) {
    if (e.button === 2) {
      this.props.cancelRenaming();
      this.props.renameFile(file);
    }
    this.setState({ selected: [file.id] });
  }

  render() {
    const { files } = this.props;
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
          if (e.target.id === "dropzone") {
            this.setState({ selected: [] });
            this.props.cancelRenaming();
          }
        }}
      >
        {files.map(this.renderFile)}
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
  openImage: image => dispatch(openImageModal(image)),
  renameFile: file => dispatch(renameFile(file)),
  deleteFile: fileId => dispatch(deleteFile(fileId)),
  cancelRenaming: () => dispatch(cancelRenaming()),
  confirmRenameFile: (file, title) => dispatch(confirmRenameFile(file, title))
});

export default connect(mapStateToProps, mapDispatchToProps)(Desktop);
