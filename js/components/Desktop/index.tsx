import React from "react";
import { connect } from "react-redux";
import { ContextMenuProvider } from "../../../node_modules/react-contexify";
import {
  viewTracksFromAlbum,
  viewAlbumsFromArtist
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
import FileItem from "./FileItem";
import FileContextMenu from "./FileContextMenu";
import { File, GenericFile } from "../../types";
import { AppState } from "../../reducers";
import { openImage } from "../../actions/images";
import { formatToWebampMetaData } from "../../utils/drag";

interface OwnProps {
  files: Array<File>;
  selectionBox: any;
}

interface DispatchProps {
  deleteFile: (fileId: string) => void;
  moveFile: (file: any) => void;
  cancelRenaming: () => void;
  createFile: (file: File) => void;
  renameFile: (id: string) => void;
  confirmRenameFile: (file: any, value?: any) => void;
  openImage: (
    uri: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  viewTracksFromAlbum: (uri: string) => void;
  viewAlbumsFromArtist: (uri: string) => void;
}

type Props = DispatchProps & OwnProps;

interface State {
  selected: Array<string>;
  clipboard: string | null;
}

class Desktop extends React.Component<Props, State> {
  constructor(props: Props) {
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
        if (!this.props.files.some(file => file.isRenaming))
          this.state.selected.map(fileId => this.props.deleteFile(fileId));
      }
    });
  }

  componentWillReceiveProps(nextProps: Props) {
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

  onDragStart(e: React.DragEvent<HTMLDivElement>, files: Array<File>) {
    e.dataTransfer.setData("isFileMoving", "true"); // TODO: Maybe revert to boolean if this breaks
    const tracks = files.map((file: any) => {
      return formatToWebampMetaData(file);
    });

    e.dataTransfer.setData("files", JSON.stringify(files)); // for desktop
    e.dataTransfer.setData("tracks", JSON.stringify(tracks)); // for winamp
  }

  onDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    const isFileMoving = e.dataTransfer.getData("isFileMoving");
    const files = JSON.parse(e.dataTransfer.getData("files"));

    if (!isFileMoving) {
      files.map((file: File) => {
        this.props.createFile({
          ...file,
          x: e.clientX - 50,
          y: e.clientY - 50
        });
      });
    } else {
      files.map((file: any) =>
        this.props.moveFile({
          id: file.id,
          x: e.clientX + file.deltaX,
          y: e.clientY + file.deltaY
        })
      );
    }
  }

  renderFile(file: File) {
    return (
      <div
        draggable={!file.isRenaming}
        onDragStart={e => {
          const selectedFiles = this.props.files
            .filter(_file => this.state.selected.indexOf(_file.id) > -1)
            .map((_file: any) => {
              _file.deltaX = _file.x - e.clientX;
              _file.deltaY = _file.y - e.clientY;
              _file.name = file.title; // TODO:
              _file.duration = Math.floor(Math.random() * 306) + 201;
              _file.defaultName = file.title;
              return _file;
            });
          this.onDragStart(e, selectedFiles);
        }}
        onMouseDown={() => {
          if (this.state.selected.length <= 1)
            this.setState({ selected: [file.id] });
        }}
      >
        <FileItem
          file={file}
          selected={this.state.selected.indexOf(file.id) !== -1}
          onDoubleClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            this.doubleClickHandler(file, e)
          }
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

  doubleClickHandler(
    file: GenericFile,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (file.metaData.type === "track")
      this.props.addTrackZeroAndPlay(file.metaData.uri);
    if (file.metaData.type === "album")
      this.props.viewTracksFromAlbum(file.metaData.uri);
    if (file.metaData.type === "artist")
      this.props.viewAlbumsFromArtist(file.metaData.uri);
    if (file.metaData.type === "image")
      this.props.openImage(file.metaData.url, e);
  }

  handleDesktopClick(e: any) {
    if (e.target.id.split(" ").indexOf("dropzone") !== -1) {
      this.setState({ selected: [] });
      if (this.props.files.some(file => file.isRenaming)) {
        const renamingInProgress = this.props.files.filter(
          file => file.isRenaming
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
          zIndex: -777
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
          onDelete={() => {
            this.state.selected.forEach(id => this.props.deleteFile(id));
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
          onTrackData={e => {
            console.log(e.ref.id);
          }}
          addToPlaylist={e => {
            const track = this.props.files.find(file => file.id === e.ref.id);
            if (track !== undefined) this.props.addTrackFromURI(track.uri);
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
const mapStateToProps = (state: AppState) => ({
  desktop: state.desktop,
  files: selectFiles(state)
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  createFile: (file: File) => {
    dispatch(createFile(file));
  },
  viewTracksFromAlbum: (album: string) => dispatch(viewTracksFromAlbum(album)),
  viewAlbumsFromArtist: (artist: string) =>
    dispatch(viewAlbumsFromArtist(artist)),
  moveFile: (file: File) => dispatch(moveFile(file)),
  openImage: (image: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    dispatch(openImage(image, e)),
  renameFile: (id: string) => dispatch(renameFile(id)),
  deleteFile: (fileId: string) => dispatch(deleteFile(fileId)),
  cancelRenaming: () => dispatch(cancelRenaming()),
  confirmRenameFile: (file: any, title: string) =>
    dispatch(confirmRenameFile(file, title))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Desktop);
