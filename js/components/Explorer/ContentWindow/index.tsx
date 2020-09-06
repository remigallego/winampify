import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VirtualList from "react-tiny-virtual-list";
import { setDataTransferTracks } from "../../../actions/dataTransfer";
import {
  selectFile,
  setItems,
  setScrollOffset,
  unsetFocusExplorer
} from "../../../actions/explorer";
import { openImage } from "../../../actions/images";
import { setTracksToPlay } from "../../../actions/webamp";
import {
  getAlbumsFromArtist,
  getTracksFromAlbum
} from "../../../api/apiFunctions";
import { AppState } from "../../../reducers";
import { SingleExplorerState } from "../../../reducers/explorer";
import { greenSpotify } from "../../../styles/colors";
import { GenericFile, OPEN_FOLDER_ACTION } from "../../../types";
import {
  isAlbum,
  isArtist,
  isImage,
  isPlaylist,
  isSkin,
  isTrack
} from "../../../types/typecheckers";
import { formatMetaToWebampMeta } from "../../../utils/dataTransfer";
import ContentLoading from "../../Reusables/ContentLoading";
import ExplorerFile from "./ExplorerFile";
import SearchResults from "./SearchResults";

declare global {
  interface Window {
    dataTransferObject?: any;
  }
}

interface Props {
  explorer: SingleExplorerState;
  files: GenericFile[] | null;
}

const ContentWindow = (props: Props) => {
  const { explorer, files } = props;
  /*  const [scrollOffset, setScrollOffset] = useState(0); */
  const [holdShift, toggleHoldShift] = useState(false);
  const selectedFiles = useSelector<AppState, string[]>(
    state => state.explorer.byId[explorer.id].selectedFiles
  );
  const webampInstance = useSelector(
    (state: AppState) => state.webamp.webampObject
  );
  const scrollOffset = useSelector(
    (state: AppState) => state.explorer.byId[explorer.id].scrollOffset
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
    if (isImage(file)) dispatch(openImage(file, e));
    if (isPlaylist(file))
      dispatch(
        setItems(OPEN_FOLDER_ACTION.PLAYLIST, file.metaData.id, explorer.id)
      );
    // TODO: Skins are currently supported but we're waiting on a list of URLs we can use.
    if (isSkin(file)) {
      webampInstance.setSkinFromUrl(
        "https://s3.amazonaws.com/webamp-uploaded-skins/skins/6c755ae8df5d6aabbac040d1b6bcb0ec.wsz"
      );
      webampInstance
        .skinIsLoaded()
        .then(() => {
          console.log("loaded");
        })
        .catch(e => console.log(e));
    }
  };

  const onDrag = async (e: any, draggedFiles: GenericFile[]) => {
    e.persist();
    const dataTransferObject = e.dataTransfer;
    const emptyImage = document.createElement("img");
    emptyImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    dataTransferObject.setDragImage(emptyImage, 0, 0);

    const formattedFilesForWebamp: any[] = [];
    const filesForDesktop: any[] = [];
    draggedFiles.forEach(async item => {
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

  if (files.length === 0 && explorer.loading)
    return <ContentLoading color={greenSpotify} />;
  if (!files) return null;
  if (explorer.query)
    return (
      <SearchResults
        explorer={explorer}
        files={files}
        handleClickOutside={handleClickOutside}
        setScrollOffset={o => dispatch(setScrollOffset(o, explorer.id))}
        scrollOffset={scrollOffset}
        renderFile={renderFile}
      />
    );
  return (
    <VirtualList
      scrollOffset={scrollOffset}
      onScroll={o => dispatch(setScrollOffset(o, explorer.id))}
      width={"100%"}
      height={props.explorer.height - 68} // 68 represents the title bar + toolbar
      itemCount={props.files.length}
      itemSize={23}
      overscanCount={6}
      renderItem={({ index, style }) => (
        <div key={index} style={style}>
          {renderFile(props.files[index])}
        </div>
      )}
    />
  );
};

export default ContentWindow;
