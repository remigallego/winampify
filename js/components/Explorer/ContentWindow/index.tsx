import React, { useEffect, useState, PureComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { setDataTransferTracks } from "../../../actions/dataTransfer";
import {
  selectFile,
  setItems,
  setMoreSearchResults,
  unsetFocusExplorer
} from "../../../actions/explorer";
import { openImage } from "../../../actions/images";
import {
  getAlbumsFromArtist,
  getTracksFromAlbum
} from "../../../api/apiFunctions";
import { AppState } from "../../../reducers";
import { SingleExplorerState } from "../../../reducers/explorer";
import { QueryState } from "../../../reducers/search-pagination";
import { selectSearch } from "../../../selectors/search";
import { blueTitleBar, greenSpotify } from "../../../styles/colors";
import { GenericFile, OPEN_FOLDER_ACTION } from "../../../types";
import {
  isAlbum,
  isArtist,
  isImage,
  isPlaylist,
  isTrack
} from "../../../types/typecheckers";
import { formatMetaToWebampMeta } from "../../../utils/dataTransfer";
import ContentLoading from "../../Reusables/ContentLoading";
import ExplorerFile from "../ExplorerFile";
import styles from "./styles";
import { setTracksToPlay } from "../../../actions/webamp";
import VirtualList from "react-tiny-virtual-list";

declare global {
  interface Window {
    dataTransferObject?: any;
  }
}

interface Props {
  explorer: SingleExplorerState;
  files: GenericFile[] | null;
}

export default function(props: Props) {
  const { explorer } = props;
  const [scrollOffset, setScrollOffset] = useState(0);
  const [holdShift, toggleHoldShift] = useState(false);
  const selectedFiles = useSelector<AppState, string[]>(
    state => state.explorer.byId[explorer.id].selectedFiles
  );
  const searchPagination = useSelector<AppState, QueryState>(state =>
    selectSearch(state, explorer.id)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", e => {
      if (e.keyCode === 16) toggleHoldShift(true);
    });
    document.addEventListener("keyup", e => {
      if (e.keyCode === 16) toggleHoldShift(false);
    });
  }, []);

  const doubleClickHandler = (
    file: GenericFile,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isTrack(file)) dispatch(setTracksToPlay([file]));
    if (isAlbum(file))
      dispatch(
        setItems(OPEN_FOLDER_ACTION.ALBUM, file.metaData.id, explorer.id)
      );
    if (isArtist(file))
      dispatch(
        setItems(OPEN_FOLDER_ACTION.ARTIST, file.metaData.id, explorer.id)
      );
    if (isImage(file)) dispatch(openImage(file.metaData.url, e));
    if (isPlaylist(file))
      dispatch(
        setItems(OPEN_FOLDER_ACTION.PLAYLIST, file.metaData.id, explorer.id)
      );
  };

  const onDrag = async (e: any, files: GenericFile[]) => {
    e.persist();
    const dataTransferObject = e.dataTransfer;
    const emptyImage = document.createElement("img");
    emptyImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    dataTransferObject.setDragImage(emptyImage, 0, 0);

    const formattedFilesForWebamp: any[] = [];
    const filesForDesktop: any[] = [];
    files.forEach(async item => {
      filesForDesktop.push(item);
      if (isTrack(item)) {
        formattedFilesForWebamp.push(formatMetaToWebampMeta(item.metaData));
      }
      if (isAlbum(item)) {
        if (item.metaData.tracks) {
          return item.metaData.tracks.items.map((trackItem: any) =>
            formattedFilesForWebamp.push(formatMetaToWebampMeta(trackItem))
          );
        } else {
          const tracks = await getTracksFromAlbum(
            item.metaData.uri.split(":")[2]
          );
          tracks.forEach(trackItem =>
            formattedFilesForWebamp.push(formatMetaToWebampMeta(trackItem))
          );

          dispatch(
            setDataTransferTracks(formattedFilesForWebamp.flat(), explorer.id)
          );
        }
      }
      if (isArtist(item)) {
        const albums = await getAlbumsFromArtist(
          item.metaData.uri.split(":")[2]
        );
        const promises = albums.map(async album => {
          const tracks = await getTracksFromAlbum(album.uri.split(":")[2]);
          tracks.forEach(trackItem =>
            formattedFilesForWebamp.push(formatMetaToWebampMeta(trackItem))
          );
        });
        Promise.all(promises).then(() => {
          dispatch(
            setDataTransferTracks(formattedFilesForWebamp.flat(), explorer.id)
          );
        });
      }
    });

    dispatch(
      setDataTransferTracks(formattedFilesForWebamp.flat(), explorer.id)
    );
    e.dataTransfer.setData("dragged_files", JSON.stringify(filesForDesktop)); // for desktop
  };

  const handleShiftSelect = (f: GenericFile) => {
    const indexOfFileSelected = props.files.indexOf(f);
    const indexOfFilePreviouslySelected = props.files.indexOf(
      props.files.find(item => selectedFiles[0] === item.id)
    );
    if (indexOfFileSelected >= indexOfFilePreviouslySelected) {
      dispatch(
        selectFile(
          props.files
            .filter(
              (omit, index) =>
                index >= indexOfFilePreviouslySelected &&
                index <= indexOfFileSelected
            )
            .map(item => item.id),
          explorer.id
        )
      );
    }
    if (indexOfFileSelected <= indexOfFilePreviouslySelected) {
      dispatch(
        selectFile(
          props.files
            .filter(
              (omit, index) =>
                index >= indexOfFileSelected &&
                index <= indexOfFilePreviouslySelected
            )
            .map(item => item.id),
          explorer.id
        )
      );
    }
  };

  const renderFile = (file: GenericFile) => {
    const selected = props.explorer.selectedFiles.includes(file.id);
    const getExtension = () => {
      if (isTrack(file)) return ".mp3";
      if (isImage(file)) return ".jpg";
      return null;
    };

    return (
      <ExplorerFile
        key={file.id}
        file={file}
        selected={selected}
        onDrag={(e: any) =>
          onDrag(
            e,
            props.files.filter(item => selectedFiles.includes(item.id))
          )
        }
        onClick={() => {
          if (holdShift && selectedFiles.length === 1) {
            handleShiftSelect(file);
            return;
          } else if (selectedFiles.includes(file.id)) {
            return;
          } else dispatch(selectFile([file.id], explorer.id));
        }}
        onDoubleClick={e => doubleClickHandler(file, e)}
      >
        {file.title}
        {getExtension()}
      </ExplorerFile>
    );
  };

  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((e as any).target.className === "explorer-items-container") {
      dispatch(unsetFocusExplorer(props.explorer.id));
    }
  };

  const renderNoResults = () => {
    return <div style={styles.noResults}>No results found</div>;
  };

  const renderSearchResults = () => {
    if (!searchPagination.filter.types.length)
      return (
        <div
          className="explorer-items-container"
          onMouseDown={handleClickOutside}
          style={{
            padding: 2,
            width: "100%"
          }}
        >
          <div style={styles.noResults}>
            Search filter is empty, please select at least one type.
          </div>
        </div>
      );
    const artists = props.files.filter(isArtist);
    const albums = props.files.filter(isAlbum);
    const tracks = props.files.filter(isTrack);
    const playlists = props.files.filter(isPlaylist);
    const remainingArtists =
      searchPagination.artist.total - searchPagination.artist.current;
    const remainingAlbums =
      searchPagination.album.total - searchPagination.album.current;
    const remainingTracks =
      searchPagination.track.total - searchPagination.track.current;
    const remainingPlaylists =
      searchPagination.playlist.total - searchPagination.playlist.current;

    return (
      <div
        className="explorer-items-container"
        onMouseDown={handleClickOutside}
        style={{
          padding: 2,
          width: "100%"
        }}
      >
        {searchPagination.filter.types.includes("artist") && (
          <>
            {renderCategoryHeader("Artists")}
            {artists.map(renderFile)}
            {artists.length === 0 && renderNoResults()}
            {remainingArtists > 0 && (
              <div
                style={styles.moreButton}
                onClick={() => dispatch(setMoreSearchResults("artist"))}
              >
                {searchPagination.artist.loading ? (
                  <BeatLoader color={blueTitleBar} size={5} />
                ) : (
                  `${remainingArtists} more results...`
                )}
              </div>
            )}
            <div style={{ marginTop: 20 }} />
          </>
        )}
        {searchPagination.filter.types.includes("album") && (
          <>
            {renderCategoryHeader("Albums")}
            {albums.map(renderFile)}
            {albums.length === 0 && renderNoResults()}
            {remainingAlbums > 0 && (
              <div
                style={styles.moreButton}
                onClick={() => dispatch(setMoreSearchResults("album"))}
              >
                {searchPagination.album.loading ? (
                  <BeatLoader color={blueTitleBar} size={5} />
                ) : (
                  `${remainingAlbums} more results...`
                )}
              </div>
            )}
            <div style={{ marginTop: 20 }} />
          </>
        )}
        {searchPagination.filter.types.includes("track") && (
          <>
            {renderCategoryHeader("Tracks")}
            {tracks.map(renderFile)}
            {tracks.length === 0 && renderNoResults()}
            {remainingTracks > 0 && (
              <div
                style={styles.moreButton}
                onClick={() => dispatch(setMoreSearchResults("track"))}
              >
                {searchPagination.track.loading ? (
                  <BeatLoader color={blueTitleBar} size={5} />
                ) : (
                  `${remainingTracks} more results...`
                )}
              </div>
            )}
            <div style={{ marginTop: 10 }} />
          </>
        )}
        {searchPagination.filter.types.includes("playlist") && (
          <>
            {renderCategoryHeader("Playlists")}
            {playlists.map(renderFile)}
            {playlists.length === 0 && renderNoResults()}
            {remainingPlaylists > 0 && (
              <div
                style={styles.moreButton}
                onClick={() => dispatch(setMoreSearchResults("playlist"))}
              >
                {searchPagination.playlist.loading ? (
                  <BeatLoader color={blueTitleBar} size={5} />
                ) : (
                  `${remainingPlaylists} more results...`
                )}
              </div>
            )}
            <div style={{ marginTop: 10 }} />
          </>
        )}
      </div>
    );
  };

  const renderCategoryHeader = (text: string) => (
    <div style={styles.searchCategory}>
      {text}
      <div style={styles.searchSeparator} />
    </div>
  );

  const { files } = props;

  if (explorer.loading) return <ContentLoading color={greenSpotify} />;
  if (!files) return null;
  if (explorer.query) return renderSearchResults();

  console.log("scrollOffset ===", scrollOffset);

  return (
    <VirtualList
      scrollOffset={scrollOffset}
      onScroll={offset => setScrollOffset(offset)}
      width={"100%"}
      height={props.explorer.height - 68} // 68 represents the title bar + toolbar
      itemCount={props.files.length}
      itemSize={23}
      renderItem={({ index, style }) => (
        <div key={index} style={style}>
          {renderFile(props.files[index])}
        </div>
      )}
    />
  );
}
