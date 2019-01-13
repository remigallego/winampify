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
import SelectionBox from "../SelectionBox";
// import "../../../css/spotify-ui.css";

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      clipboard: null
    };
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectionBox === this.props.selectionBox) return;
    const selected = nextProps.files
      .filter(
        file =>
          ((file.x + 50 < nextProps.selectionBox.target[0] &&
            file.x + 50 > nextProps.selectionBox.origin[0]) ||
            (file.x + 50 > nextProps.selectionBox.target[0] &&
              file.x + 50 < nextProps.selectionBox.origin[0])) &&
          ((file.y + 50 < nextProps.selectionBox.target[1] &&
            file.y + 50 > nextProps.selectionBox.origin[1]) ||
            (file.y + 50 > nextProps.selectionBox.target[1] &&
              file.y + 50 < nextProps.selectionBox.origin[1]))
      )
      .map(file => file.id);
    this.setState({
      selected
    });
  }

  onDragStart(e, files) {
    e.dataTransfer.setData("isFileMoving", true);
    e.dataTransfer.setData("files", JSON.stringify(files)); // dataTransfer only accepts strings
  }

  onDrop(e) {
    e.preventDefault();
    const isFileMoving = e.dataTransfer.getData("isFileMoving");
    const files = JSON.parse(e.dataTransfer.getData("files"));

    if (!isFileMoving) {
      files.map(file =>
        this.props.createFile({
          uri: file.uri,
          x: e.clientX - 50,
          y: e.clientY - 50,
          title: file.title,
          type: file.type
        })
      );
    } else {
      files.map(file =>
        this.props.moveFile({
          id: file.id,
          x: e.clientX + file.deltaX,
          y: e.clientY + file.deltaY
        })
      );
    }
  }

  renderFile(file) {
    return (
      <div
        draggable={!file.renaming}
        onDragStart={e => {
          const selectedFiles = this.props.files
            .filter(_file => this.state.selected.indexOf(_file.id) > -1)
            .map(_file => {
              _file.deltaX = _file.x - e.clientX;
              _file.deltaY = _file.y - e.clientY;
              return _file;
            });
          this.onDragStart(e, selectedFiles);
        }}
        onMouseDown={() => {
          if (this.state.selected.length <= 1)
            this.setState({ selected: [file.id] });
        }}
      >
        <File
          file={file}
          selected={this.state.selected.indexOf(file.id) !== -1}
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
    if (e.target.id.split(" ").indexOf("dropzone") !== -1) {
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
        className="selectzone"
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
            id="dropzone selectzone"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            onMouseDown={e => this.handleDesktopClick(e)}
            // onClick={e => this.handleDesktopClick(e)}
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
