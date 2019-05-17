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
import { QueryState } from "../../../reducers/search-pagination";
import { selectSearch } from "../../../selectors/search";
import { greenSpotify } from "../../../styles/colors";
import {
  ACTION_TYPE,
  AlbumFile,
  ArtistFile,
  GenericFile,
  TrackFile
} from "../../../types";
import {
  isAlbum,
  isArtist,
  isImage,
  isTrack
} from "../../../types/typecheckers";
import ContentLoading from "../../Reusables/ContentLoading";
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

  renderFile(file: GenericFile) {
    const selected = this.props.explorer.selected === file.id;
    const getExtension = (type: string) => {
      if (type === "track") return ".mp3";
      if (type === "image") return ".jpg";
      return null;
    };
    return (
      <ExplorerFile
        key={file.id}
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

  render() {
    if (this.props.explorer.loading)
      return <ContentLoading color={greenSpotify} />;

    const { files } = this.props;
    if (!files) return;

    const artists = files.filter(isArtist).map((file: ArtistFile) => file);
    const albums = files.filter(isAlbum).map((file: AlbumFile) => file);
    const tracks = files.filter(isTrack).map((file: TrackFile) => file);

    if (this.props.explorer.query) {
      return (
        <div
          className="explorer-items-container"
          onMouseDown={e => this.handleClickOutside(e)}
          style={container}
        >
          {artists.length && (
            <>
              {this.renderSearchCategory("Artists")}
              {artists.map(file => this.renderFile(file))}
              <div
                style={styles.moreButton}
                onClick={() => this.props.setMoreSearchResults("artist")}
              >
                20 more results...
              </div>
              <div style={{ marginTop: 20 }} />
            </>
          )}

          {albums.length && (
            <>
              {this.renderSearchCategory("Albums")}
              {albums.map(file => this.renderFile(file))}
              <div style={styles.moreButton}>20 more results...</div>
              <div style={{ marginTop: 20 }} />
            </>
          )}

          {tracks.length && (
            <>
              {this.renderSearchCategory("Tracks")}
              {tracks.map(file => this.renderFile(file))}
              <div style={styles.moreButton}>20 more results...</div>
              <div style={{ marginTop: 10 }} />
            </>
          )}
        </div>
      );
    } else
      return (
        <div
          className="explorer-items-container"
          onMouseDown={e => this.handleClickOutside(e)}
          style={container}
        >
          {files.map(file => this.renderFile(file))}
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
