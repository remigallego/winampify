import React from "react";
import { connect } from "react-redux";

import {
  unsetFocusExplorer,
  getArtistFromId,
  selectFile,
  setItems,
  ACTION_TYPE
} from "../../actions/explorer";
import { ExplorerContentStyle } from "./styles";
import ExplorerItem from "./ExplorerItem";
import { GenericFile, FILE_TYPE, TrackFile } from "../../types";
import { SingleExplorerState } from "../../reducers/explorer";
import { openImage } from "../../actions/images";
import { playTrack } from "../../actions/playback";
import { greenSpotify } from "../../colors";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "../../reducers";

const { container } = ExplorerContentStyle;

interface OwnProps {
  explorer: SingleExplorerState;
  selected: boolean;
  files: GenericFile[] | null;
}

interface DispatchProps {
  selectFile(id: string): void;
  playTrack(file: TrackFile): void;
  getArtistInfo(id: string): void;
  unsetFocusExplorer(): void;
  openImage(
    image: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void;
  setItems(uriType: ACTION_TYPE, uri: string): void;
}

type Props = OwnProps & DispatchProps;
class ExplorerContent extends React.Component<Props> {
  timer: any = null;

  clickHandler(id: string) {
    this.props.selectFile(id);
  }

  renderAlbums(albums: GenericFile[]) {
    if (albums)
      return albums.map((album, index) => {
        return this.renderFile(album, `al${index}`);
      });
    return null;
  }

  renderTracks(tracks: GenericFile[]) {
    if (tracks)
      return tracks.map((track, index) => {
        return this.renderFile(track, `tr${index}`);
      });
    return null;
  }

  renderArtists(artists: GenericFile[]) {
    if (artists)
      return artists.map((artist, index) => {
        return this.renderFile(artist, `ar${index}`);
      });
    return null;
  }

  renderImages(images: GenericFile[]) {
    if (images)
      return images.map((image, index) => {
        return this.renderFile(image, `im${index}`);
      });
    return null;
  }

  doubleClickHandler(
    file: GenericFile,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (file.metaData.type === FILE_TYPE.TRACK)
      this.props.playTrack(file as TrackFile);
    if (file.metaData.type === FILE_TYPE.ALBUM)
      this.props.setItems(ACTION_TYPE.ALBUM, file.metaData.id);
    if (file.metaData.type === FILE_TYPE.ARTIST)
      this.props.setItems(ACTION_TYPE.ARTIST, file.metaData.id);
    if (file.metaData.type === FILE_TYPE.IMAGE)
      this.props.openImage(file.metaData.url, e);
  }

  renderFile(file: GenericFile, index: string) {
    const selected = this.props.explorer.selected === file.id;
    const getExtension = (type: string) => {
      if (type === "track") return ".mp3";
      if (type === "image") return ".jpg";
      return null;
    };
    return (
      <ExplorerItem
        key={index}
        file={file}
        selected={selected}
        onClick={() => this.props.selectFile(file.id)} // was -1 for image
        onDoubleClick={e => this.doubleClickHandler(file, e)}
      >
        {file.title}
        {getExtension(file.metaData.type)}
      </ExplorerItem>
    );
  }

  handleClickOutside(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if ((e as any).target.className === "explorer-items-container") {
      e.preventDefault();
      this.props.unsetFocusExplorer();
    }
  }

  renderLoadedItems() {
    const { files } = this.props;
    if (!files) {
      return;
    }

    const artists = files
      .filter((file: GenericFile) => file.metaData.type === "artist")
      .map((file: GenericFile) => file);

    const albums = files
      .filter((file: GenericFile) => file.metaData.type === "album")
      .map((file: GenericFile) => file);

    const tracks = files
      .filter((file: GenericFile) => file.metaData.type === "track")
      .map((file: GenericFile) => file);

    const images = files
      .filter((file: GenericFile) => file.metaData.type === "image")
      .map((file: GenericFile) => file);

    return (
      <div>
        {this.renderArtists(artists)}
        {this.renderAlbums(albums)}
        {this.renderTracks(tracks)}
        {this.renderImages(images)}
      </div>
    );
  }

  renderLoading() {
    return (
      <div
        style={{
          color: greenSpotify,
          margin: "0 auto",
          paddingTop: "100px"
        }}
        className="la-line-scale la-2x"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  }

  render() {
    return (
      <div
        className="explorer-items-container"
        onMouseDown={e => this.handleClickOutside(e)}
        style={container}
      >
        {this.props.explorer.loading
          ? this.renderLoading()
          : this.renderLoadedItems()}
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, null, Action>,
  ownProps: Props
): DispatchProps => {
  const { id: explorerId } = ownProps.explorer;
  return {
    selectFile: (id: string) => {
      dispatch(selectFile(id, explorerId));
    },
    playTrack: (file: TrackFile) => {
      dispatch(playTrack(file));
    },
    getArtistInfo: (id: string) => {
      dispatch(getArtistFromId(id));
    },
    unsetFocusExplorer: () => dispatch(unsetFocusExplorer(explorerId)),
    openImage: (
      image: string,
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => dispatch(openImage(image, e)),
    setItems: (uriType: ACTION_TYPE, uri: string) =>
      dispatch(setItems(uriType, uri, explorerId))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ExplorerContent);
