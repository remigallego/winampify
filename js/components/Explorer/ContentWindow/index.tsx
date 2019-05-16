import React from "react";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  getArtistFromId,
  selectFile,
  setItems,
  setMoreSearchResults,
  unsetFocusExplorer
} from "../../../actions/explorer";
import { openImage } from "../../../actions/images";
import { playTrack } from "../../../actions/playback";
import { AppState } from "../../../reducers";
import { SingleExplorerState } from "../../../reducers/explorer";
import { QueryState } from "../../../reducers/search";
import { selectSearch } from "../../../selectors/search";
import { greenSpotify } from "../../../styles/colors";
import {
  ACTION_TYPE,
  AlbumFile,
  ArtistFile,
  GenericFile,
  ImageFile,
  TrackFile
} from "../../../types";
import {
  isAlbum,
  isArtist,
  isImage,
  isTrack
} from "../../../types/typecheckers";
import ExplorerFile from "../ExplorerFile";
import styles from "./styles";

const { container } = styles;

interface OwnProps {
  explorer: SingleExplorerState;
  selected: boolean;
  files: GenericFile[] | null;
}

interface StateProps {
  search: QueryState;
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
  setMoreSearchResults(type: string): void;
}

type Props = OwnProps & StateProps & DispatchProps;
class ContentWindow extends React.Component<Props> {
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
      <ExplorerFile
        key={index}
        file={file}
        selected={selected}
        onClick={() => this.props.selectFile(file.id)} // was -1 for image
        onDoubleClick={e => this.doubleClickHandler(file, e)}
      >
        {file.title}
        {getExtension(file.metaData.type)}
      </ExplorerFile>
    );
  }

  handleClickOutside(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if ((e as any).target.className === "explorer-items-container") {
      e.preventDefault();
      this.props.unsetFocusExplorer();
    }
  }

  renderSearchCategory(text: string) {
    return (
      <div style={styles.searchCategory}>
        {text}
        <div style={styles.searchSeparator} />
      </div>
    );
  }

  renderLoadedItems() {
    const { files } = this.props;
    if (!files) return;

    const artists = files.filter(isArtist).map((file: ArtistFile) => file);
    const albums = files.filter(isAlbum).map((file: AlbumFile) => file);
    const tracks = files.filter(isTrack).map((file: TrackFile) => file);
    const images = files.filter(isImage).map((file: ImageFile) => file);
    if (this.props.explorer.query) {
      const { search } = this.props;
      return (
        <div>
          {artists.length && (
            <>
              {this.renderSearchCategory("Artists")}
              {this.renderArtists(artists)}
              {search.artist.total - search.artist.current > 0 && (
                <div
                  style={styles.moreButton}
                  onClick={() => this.props.setMoreSearchResults("artist")}
                >
                  {search.artist.loading
                    ? "Loading..."
                    : `${search.artist.total -
                        search.artist.current} more results...`}
                </div>
              )}
              <div style={{ marginTop: 20 }} />
            </>
          )}

          {albums.length && (
            <>
              {this.renderSearchCategory("Albums")}
              {this.renderAlbums(albums)}
              <div style={styles.moreButton}>20 more results...</div>
              <div style={{ marginTop: 20 }} />
            </>
          )}

          {tracks.length && (
            <>
              {this.renderSearchCategory("Tracks")}
              {this.renderTracks(tracks)}
              <div style={styles.moreButton}>20 more results...</div>
              <div style={{ marginTop: 10 }} />
            </>
          )}
        </div>
      );
    } else
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

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state: AppState,
  ownProps: OwnProps
) => ({
  search: selectSearch(state, ownProps)
});

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
      dispatch(setItems(uriType, uri, explorerId)),
    setMoreSearchResults: (type: "album" | "artist" | "track") =>
      dispatch(setMoreSearchResults(type))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentWindow);
