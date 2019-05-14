import React from "react";
import { connect } from "react-redux";
import { ContextMenuProvider } from "../../../node_modules/react-contexify";
import { setItems } from "../../actions/explorer";
import { openImage } from "../../actions/images";
import { playTrack } from "../../actions/playback";
import { AppState } from "../../reducers";
import {
  ACTION_TYPE,
  ActionFile,
  ArtistFile,
  GenericFile,
  ImageFile,
  TrackFile
} from "../../types";
import {
  isAction,
  isAlbum,
  isArtist,
  isImage,
  isTrack
} from "../../types/typecheckers";
import { formatToWebampMetaData } from "../../utils/drag";
import {
  cancelRenaming,
  confirmRenameFile,
  createFile,
  deleteFile,
  moveFile,
  renameFile,
  selectFiles
} from "./../../actions/desktop";
import FileContextMenu from "./FileContextMenu";
import FileItem from "./FileItem";

interface OwnProps {
  files: GenericFile[];
  selectionBox: any;
}

interface DispatchProps {
  setItems: (
    actionType: ACTION_TYPE,
    uri?: string,
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  deleteFile: (fileId: string) => void;
  moveFile: (file: any) => void;
  cancelRenaming: () => void;
  createFile: (file: GenericFile) => void;
  renameFile: (id: string) => void;
  confirmRenameFile: (file: any, value?: any) => void;
  openImage: (
    uri: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  playTrack: (track: TrackFile) => void;
}

type Props = DispatchProps & OwnProps;

interface State {
  selected: string[];
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

  onDragStart(e: React.DragEvent<HTMLDivElement>, files: GenericFile[]) {
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
      files.map((file: GenericFile) => {
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

  renderFile(file: GenericFile) {
    return (
      <div
        key={file.id}
        id={`file-${file.id}`}
        draggable={!file.isRenaming}
        onDragStart={e => {
          const selectedFiles = this.props.files
            .filter(
              derivedFile => this.state.selected.indexOf(derivedFile.id) > -1
            )
            .map((derivedFile: any) => {
              derivedFile.deltaX = derivedFile.x - e.clientX;
              derivedFile.deltaY = derivedFile.y - e.clientY;
              derivedFile.name = file.title; // TODO:
              derivedFile.duration = Math.floor(Math.random() * 306) + 201;
              derivedFile.defaultName = file.title;
              return derivedFile;
            });
          this.onDragStart(e, selectedFiles);
        }}
        onMouseDown={() => {
          if (this.state.selected.length <= 1)
            this.setState({ selected: [file.id] });
        }}
      >
        <FileItem
          key={file.id}
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
    if (file.isRenaming) return;

    if (isTrack(file)) this.props.playTrack(file);
    if (isAlbum(file))
      this.props.setItems(ACTION_TYPE.ALBUM, file.metaData.id, e);
    if (isArtist(file))
      this.props.setItems(
        ACTION_TYPE.ARTIST,
        (file as ArtistFile).metaData.id,
        e
      );
    if (isImage(file))
      this.props.openImage((file as ImageFile).metaData.url, e);
    if (isAction(file)) {
      this.props.setItems((file as ActionFile).metaData.action, undefined, e);
    }
  }

  handleDesktopClick(e: any) {
    if (e.target.id.split(" ").indexOf("dropzone") !== -1) {
      this.setState({ selected: [] });
      if (this.props.files.some(file => file.isRenaming)) {
        const filesInRenameMode = this.props.files.filter(
          file => file.isRenaming
        );

        // TODO: Doesn't work right now. This will need refactoring of the File and Desktop components
        filesInRenameMode.map(file =>
          this.props.confirmRenameFile(file, file.title)
        );
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
            if (copy) {
              this.props.createFile({
                ...copy,
                x: e.event.clientX - 25,
                y: e.event.clientY - 25
              });
            }
          }}
          onTrackData={e => {
            // TODO:
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
  createFile: (file: GenericFile) => {
    dispatch(createFile(file));
  },
  setItems: (
    actionType: ACTION_TYPE,
    uri?: string,
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => dispatch(setItems(actionType, uri ? uri : undefined, undefined, e)),
  moveFile: (file: GenericFile) => dispatch(moveFile(file)),
  openImage: (image: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    dispatch(openImage(image, e)),
  renameFile: (id: string) => dispatch(renameFile(id)),
  deleteFile: (fileId: string) => dispatch(deleteFile(fileId)),
  cancelRenaming: () => dispatch(cancelRenaming()),
  confirmRenameFile: (file: any, title: string) =>
    dispatch(confirmRenameFile(file, title)),
  playTrack: (file: TrackFile) => dispatch(playTrack(file))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Desktop);
