import React from "react";
import { connect } from "react-redux";

import {
  unsetFocusExplorer,
  getArtistFromId,
  searchOnSpotify,
  selectFile,
  setItems,
  ACTION_TYPE
} from "../../actions/explorer";
import { ExplorerContentStyle } from "./styles";
import ExplorerItem from "./ExplorerItem";
import {
  File,
  ImageFile,
  GenericFile,
  FILE_TYPE,
  TrackFile,
  ArtistFile,
  AlbumFile
} from "../../types";
import { AlbumData, TrackData } from "../../api/types";
import { SingleExplorerState } from "../../reducers/explorer";
import { openImage } from "../../actions/images";
import { playTrack } from "../../actions/playback";
import { orangeDark, orangeLight, greenSpotify } from "../../colors";

const { container } = ExplorerContentStyle;

interface Props {
  selectFile: (id: string) => void;
  playTrack: (id: string) => void;
  getArtistInfo: (id: string) => void;
  unsetFocusExplorer: () => void;
  playAlbumFromExplorer: (currentId: string) => void;
  openImage: (
    image: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  searchOnSpotify: (search: string, type: string, offset: string) => void;
  doubleclick: (id: string) => void;
  explorerId: string;
  explorer: SingleExplorerState;
  setItems: (type: ACTION_TYPE, uri: string) => void;
}

class ExplorerContent extends React.Component<Props> {
  timer: any = null;

  constructor(props: Props) {
    super(props);
  }
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
    if (file.metaData.type === FILE_TYPE.TRACK) this.props.playTrack(file);
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

  handleClickOutside(e) {
    if (e.target.className === "explorer-items-container") {
      e.preventDefault();
      this.props.unsetFocusExplorer();
    }
  }

  renderCategory(text: string) {
    if (this.props.explorer.currentId === "search") {
      const count = () => {
        switch (text) {
          case "Artists": {
            if (this.props.explorer.files)
              return this.props.explorer.artists.length;
            return 0;
          }
          case "Albums": {
            if (this.props.explorer.albums)
              return this.props.explorer.albums.length;
            return 0;
          }
          case "Tracks": {
            if (this.props.explorer.tracks)
              return this.props.explorer.tracks.length;
            return 0;
          }
          default:
            return 0;
        }
      };
      return (
        <div style={ExplorerContentStyle.resultCategories}>
          {text} ({count()})
        </div>
      );
    }
    return null;
  }

  renderMore(type: string) {
    return (
      <div
        style={ExplorerContentStyle.moreButton}
        /* onClick={() =>
          this.props.searchOnSpotify(
            this.props.explorer.title,
            type,
            this.props.explorer.tracks.length.toString()
          )
        } */
      >
        More...
      </div>
    );
  }

  renderLoadedItems() {
    const { files } = this.props.explorer;
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
        {this.renderCategory("Artists")}
        {this.renderArtists(artists)}
        {artists &&
          this.props.explorer.currentId === "search" &&
          !(artists.length % 20) &&
          this.renderMore("artist")}
        {this.renderCategory("Albums")}
        {this.renderAlbums(albums)}
        {albums &&
          this.props.explorer.currentId === "search" &&
          !(albums.length % 20) &&
          this.renderMore("album")}
        {this.renderCategory("Tracks")}
        {this.renderTracks(tracks)}
        {tracks &&
          this.props.explorer.currentId === "search" &&
          !(tracks.length % 20) &&
          this.renderMore("track")}
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

const mapDispatchToProps = (dispatch: any, ownProps: Props) => ({
  selectFile: (id: number) => {
    dispatch(selectFile(id, ownProps.explorerId));
  },
  playTrack: (file: TrackFile) => {
    dispatch(playTrack(file));
  },
  getArtistInfo: (id: string) => {
    dispatch(getArtistFromId(id));
  },
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer(ownProps.explorerId)),
  playAlbumFromExplorer: (currentId: string) =>
    dispatch(playAlbumFromExplorer(currentId, ownProps.explorerId)),
  openImage: (image: string, e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    dispatch(openImage(image, e)),
  searchOnSpotify: (search: string, type: string, offset: string) =>
    dispatch(searchOnSpotify(search, type, offset, ownProps.explorerId)),
  setItems: (uriType: FILE_TYPE, uri: string) =>
    dispatch(setItems(uriType, uri, ownProps.explorerId))
});

export default connect(
  null,
  mapDispatchToProps
)(ExplorerContent);
