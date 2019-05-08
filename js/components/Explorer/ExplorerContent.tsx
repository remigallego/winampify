import React from "react";
import { connect, MapDispatchToProps } from "react-redux";

import {
  unsetFocusExplorer,
  getArtistFromId,
  selectFile,
  setItems,
  ACTION_TYPE
} from "../../actions/explorer";
import { ExplorerContentStyle } from "./styles";
import ExplorerItem from "./ExplorerItem";
import {
  GenericFile,
  TrackFile,
  AlbumFile,
  ArtistFile,
  ImageFile
} from "../../types";
import { SingleExplorerState } from "../../reducers/explorer";
import { openImage } from "../../actions/images";
import { playTrack } from "../../actions/playback";
import { greenSpotify } from "../../styles/colors";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "../../reducers";
import { isTrack, isAlbum, isArtist, isImage } from "../../types/typecheckers";

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

  renderAlbums(albums: AlbumFile[]) {
    if (albums)
      return albums.map((album, index) => {
        return this.renderFile(album, `al${index}`);
      });
    return null;
  }

  renderTracks(tracks: TrackFile[]) {
    if (tracks)
      return tracks.map((track, index) => {
        return this.renderFile(track, `tr${index}`);
      });
    return null;
  }

  renderArtists(artists: ArtistFile[]) {
    if (artists)
      return artists.map((artist, index) => {
        return this.renderFile(artist, `ar${index}`);
      });
    return null;
  }

  renderImages(images: ImageFile[]) {
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
    if (isTrack(file)) this.props.playTrack(file);
    if (isAlbum(file)) this.props.setItems(ACTION_TYPE.ALBUM, file.metaData.id);
    if (isArtist(file))
      this.props.setItems(ACTION_TYPE.ARTIST, file.metaData.id);
    if (isImage(file)) this.props.openImage(file.metaData.url, e);
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
    if (!files) return;

    const artists = files.filter(isArtist).map((file: ArtistFile) => file);
    const albums = files.filter(isAlbum).map((file: AlbumFile) => file);
    const tracks = files.filter(isTrack).map((file: TrackFile) => file);
    const images = files.filter(isImage).map((file: ImageFile) => file);

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

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch: ThunkDispatch<AppState, null, Action>,
  ownProps: OwnProps
) => {
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
