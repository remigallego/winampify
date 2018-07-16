import React from "react";
import { connect } from "react-redux";
import { addTrackZeroAndPlay, addTrackFromURI } from "../../actionCreators";
import { ContextMenuProvider } from "../../../node_modules/react-contexify";
import {
  viewTracksFromAlbum,
  viewAlbumsFromArtist,
  addImage
} from "./../../actions/explorer";
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
import FileContextMenu from "./FileContextMenu";
// import "../../../css/spotify-ui.css";

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: [], clipboard: null };
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
  }

  componentWillMount() {
    addEventListener("contextmenu", e => {
      e.preventDefault();
    });
    addEventListener("keydown", e => {
      if (e.keyCode === 46) {
        // SUPPR
        if (!this.props.files.some(file => file.renaming))
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
          onClick={() => this.setState({ selected: [file.id] })}
          onDoubleClick={e => this.doubleClickHandler(file, e)}
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

  doubleClickHandler(file, e) {
    if (file.type === "track") this.props.addTrackZeroAndPlay(file.uri);
    if (file.type === "album") this.props.viewTracksFromAlbum(file.uri);
    if (file.type === "artist") this.props.viewAlbumsFromArtist(file.uri);
    if (file.type === "image")
      this.props.openImage(
        file.uri,
        e.nativeEvent.clientX,
        e.nativeEvent.clientY
      );
  }

  handleDesktopClick(e) {
    if (e.target.id === "dropzone") {
      this.setState({ selected: [] });
      if (this.props.files.some(file => file.renaming)) {
        const renamingInProgress = this.props.files.filter(
          file => file.renaming
        );
        renamingInProgress.map(file => this.props.confirmRenameFile(file.id));
      }
    }
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
      >
        <FileContextMenu
          onRename={e => {
            this.props.cancelRenaming();
            this.props.renameFile(e.ref.id);
          }}
          onDelete={e => {
            this.props.deleteFile(e.ref.id);
          }}
          onCopy={e => {
            this.setState({ clipboard: e.ref.id });
          }}
          onPaste={e => {
            const copy = this.props.files.find(
              file => file.id === this.state.clipboard
            );
            if (copy)
              this.props.createFile({
                ...copy,
                x: e.event.clientX - 25,
                y: e.event.clientY - 25
              });
          }}
          addToPlaylist={e => {
            const track = this.props.files.find(file => file.id === e.ref.id);

            this.props.addTrackFromURI(track.uri);
          }}
        />
        <ContextMenuProvider id="desktop">
          <div
            id="dropzone"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            onClick={e => this.handleDesktopClick(e)}
          />
        </ContextMenuProvider>
        {files.map(this.renderFile)}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  desktop: state.desktop,
  files: selectFiles(state),
  albumCovers: state.display.albumCovers
});

const mapDispatchToProps = dispatch => ({
  createFile: file => {
    dispatch(createFile(file));
  },
  viewTracksFromAlbum: album => dispatch(viewTracksFromAlbum(album)),
  viewAlbumsFromArtist: artist => dispatch(viewAlbumsFromArtist(artist)),
  addTrackZeroAndPlay: track => dispatch(addTrackZeroAndPlay(track)),
  moveFile: file => dispatch(moveFile(file)),
  openImage: (image, x, y) => dispatch(addImage(image, x, y)),
  renameFile: file => dispatch(renameFile(file)),
  deleteFile: fileId => dispatch(deleteFile(fileId)),
  cancelRenaming: () => dispatch(cancelRenaming()),
  confirmRenameFile: (file, title) => dispatch(confirmRenameFile(file, title)),
  addTrackFromURI: uri => dispatch(addTrackFromURI(uri))
});

export default connect(mapStateToProps, mapDispatchToProps)(Desktop);
