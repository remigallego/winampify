import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuProvider } from "../../../node_modules/react-contexify";
import { setDataTransferTracks } from "../../actions/dataTransfer";
import { setItems } from "../../actions/explorer";
import { openImage } from "../../actions/images";
import { setTracksToPlay } from "../../actions/webamp";
import { AppState } from "../../reducers";
import { DesktopState } from "../../reducers/desktop";
import {
  ActionFile,
  ArtistFile,
  GenericFile,
  ImageFile,
  OPEN_FOLDER_ACTION,
  PlaylistFile
} from "../../types";
import {
  isAction,
  isAlbum,
  isArtist,
  isImage,
  isPlaylist,
  isTrack
} from "../../types/typecheckers";
import { formatMetaToWebampMeta } from "../../utils/dataTransfer";
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
import { toggleSettingsMenu } from "../../actions/settings";

interface Props {
  selectionBox: any;
}

export default (props: Props) => {
  const [selectedFilesIds, setSelectedFiles] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState(null);
  const desktop = useSelector<AppState, DesktopState>(state => state.desktop);
  const allFiles = useSelector(selectFiles);
  const dispatch = useDispatch();

  useEffect(() => {
    addEventListener("contextmenu", e => e.preventDefault());
    addEventListener("keydown", e => {
      if (e.keyCode === 46) {
        if (!allFiles.some(file => file.isRenaming))
          selectedFilesIds.map(fileId => dispatch(deleteFile(fileId)));
      }
    });
  }, []);

  // Handles changing the selected files based on the selection box.
  useEffect(() => {
    const { target, origin } = props.selectionBox;

    const selected = allFiles
      .filter(
        file =>
          ((file.x + 50 < target.x && file.x + 50 > origin.x) ||
            (file.x + 50 > target.x && file.x + 50 < origin.x)) &&
          ((file.y + 50 < target.y && file.y + 50 > origin.y) ||
            (file.y + 50 > target.y && file.y + 50 < origin.y))
      )
      .map(file => file.id);
    setSelectedFiles(selected);
  }, [props.selectionBox]);

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    draggedFiles: GenericFile[]
  ) => {
    dispatch(
      setDataTransferTracks(
        draggedFiles
          .filter(isTrack)
          .map(file => formatMetaToWebampMeta(file.metaData))
          .flat(),
        "desktop"
      )
    );
    e.dataTransfer.setData("dragged_files", JSON.stringify(draggedFiles));
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files: GenericFile[] = JSON.parse(
      e.dataTransfer.getData("dragged_files")
    );

    const isNewFile = (file: GenericFile) =>
      desktop.byId[file.id] === undefined || desktop.byId[file.id] === null;

    let offsetX = 0;
    let offsetY = 0;

    // Checking if the file already exists on the Desktop. If not, we create it. If yes, we move the existing.
    files.forEach((file: GenericFile) => {
      if (isNewFile(file)) {
        dispatch(
          createFile({
            ...file,
            x: e.clientX - 50 + offsetX,
            y: e.clientY - 50 + offsetY
          })
        );
        if (e.clientX + offsetX > window.innerWidth - 100) {
          offsetY += 100;
          offsetX = 0;
        } else offsetX += 100;
      } else {
        dispatch(
          moveFile({
            ...file,
            id: file.id,
            x: e.clientX + file.deltaX,
            y: e.clientY + file.deltaY
          })
        );
      }
    });
  };

  const renderFile = (file: GenericFile) => {
    return (
      <div
        key={file.id}
        id={`file-${file.id}`}
        draggable={!file.isRenaming}
        onDragStart={e => {
          const selectedFilesWithDerivedData = allFiles
            .filter(f => selectedFilesIds.indexOf(f.id) > -1)
            .map((f: GenericFile) => {
              const derivedFile: any = f;
              derivedFile.deltaX = derivedFile.x - e.clientX;
              derivedFile.deltaY = derivedFile.y - e.clientY;
              derivedFile.name = derivedFile.title;
              derivedFile.duration = Math.floor(Math.random() * 306) + 201;
              derivedFile.defaultName = derivedFile.title;
              return derivedFile;
            });
          onDragStart(e, selectedFilesWithDerivedData);
        }}
        onMouseDown={() => {
          if (selectedFilesIds.length <= 1) setSelectedFiles([file.id]);
        }}
      >
        <FileItem
          key={file.id}
          file={file}
          selected={selectedFilesIds.indexOf(file.id) !== -1}
          onDoubleClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            doubleClickHandler(file, e)
          }
          confirmRenameFile={e => {
            e.preventDefault();
            if (e.target[0].value.length === 0) {
              return;
            }
            dispatch(confirmRenameFile(file, e.target[0].value));
          }}
        />
      </div>
    );
  };

  const doubleClickHandler = (
    file: GenericFile,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (file.isRenaming) return;
    if (isTrack(file)) dispatch(setTracksToPlay([file]));
    if (isAlbum(file))
      dispatch(
        setItems(
          OPEN_FOLDER_ACTION.ALBUM,
          file.metaData.id ?? file.metaData.id,
          undefined,
          e
        )
      );
    if (isArtist(file))
      dispatch(
        setItems(
          OPEN_FOLDER_ACTION.ARTIST,
          (file as ArtistFile).metaData.id ?? (file as ArtistFile).metaData.id,
          undefined,
          e
        )
      );
    if (isImage(file)) dispatch(openImage((file as ImageFile).metaData.url, e));
    if (isPlaylist(file))
      dispatch(
        setItems(
          OPEN_FOLDER_ACTION.PLAYLIST,
          (file as PlaylistFile).metaData.id ??
            (file as PlaylistFile).metaData.id,
          undefined,
          e
        )
      );
    if (isAction(file)) {
      if (file.metaData.action === OPEN_FOLDER_ACTION.SETTINGS) {
        dispatch(toggleSettingsMenu());
      } else
        dispatch(
          setItems(
            (file as ActionFile).metaData.action,
            undefined,
            undefined,
            e
          )
        );
    }
  };

  const handleDesktopClick = (e: any) => {
    if (e.target.id.split(" ").indexOf("dropzone") !== -1) {
      setSelectedFiles([]);
      if (allFiles.some(file => file.isRenaming)) {
        const filesInRenameMode = allFiles.filter(file => file.isRenaming);

        // TODO: Doesn't work right now. This will need refactoring of the File and Desktop components
        filesInRenameMode.map(file =>
          dispatch(confirmRenameFile(file, file.title))
        );
      }
    }
  };

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
      onDrop={onDrop}
      onDragOver={e => {
        e.preventDefault();
      }}
    >
      <FileContextMenu
        onRename={e => {
          dispatch(cancelRenaming());
          dispatch(renameFile(e.event.target.id));
        }}
        onDelete={() => {
          selectedFilesIds.forEach(id => dispatch(deleteFile(id)));
        }}
        onCopy={e => {
          setClipboard(e.event.target.id);
        }}
        onPaste={e => {
          const copy = allFiles.find(file => file.id === clipboard);
          if (copy) {
            dispatch(
              createFile({
                ...copy,
                x: e.event.clientX - 25,
                y: e.event.clientY - 25
              })
            );
          }
        }}
        onTrackData={e => {
          // TODO:
        }}
      />
      <MenuProvider id="desktop">
        <div
          id="dropzone selectzone"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
          onMouseDown={e => handleDesktopClick(e)}
        />
      </MenuProvider>
      {allFiles.map(renderFile)}
    </div>
  );
};
