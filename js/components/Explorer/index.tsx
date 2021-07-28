import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Rnd, DraggableData } from "react-rnd";
import styled from "styled-components";
import {
  closeExplorer,
  setItems,
  setTracksToPlaylist,
  updatePosition,
  updateSize
} from "../../actions/explorer";
import { toggleMinimize } from "../../actions/windows";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { redError } from "../../styles/colors";
import Signin from "../Reusables/SigninButton";
import "./animations.css";
import ContentWindow from "./ContentWindow";
import ExplorerParameters from "./ExplorerParameters";
import TitleBar from "./TitleBar";
import ExplorerToolbar from "./Toolbar";
import { dragHandleClassName } from "./vars";

interface Props {
  explorer: SingleExplorerState;
}

export default (props: Props) => {
  const { explorer } = props;
  const [isDropping, setDropping] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dataTransferArray = useSelector(
    (state: AppState) => state.dataTransfer
  );
  const isLogged = useSelector((state: AppState) => state.auth.logged);
  const dispatch = useDispatch();

  const errorMessage = useSelector(
    (state: AppState) => state.auth.errorMessage
  );

  const allowDrop =
    explorer.dropEnabled && dataTransferArray.source !== props.explorer.id;

  useEffect(() => {
    dispatch(setItems(explorer.action, explorer.uri, explorer.id));
  }, [isLogged]);

  const onDragStop = (data: DraggableData) => {
    const { clientHeight, clientWidth } = document.documentElement;
    const { width: explorerWidth, height: explorerHeight } = explorer;
    const rightMostPoint = data.x + explorer.width;
    const bottomMostPoint = data.y + explorer.height;

    let x = data.x;
    let y = data.y;

    if (rightMostPoint > clientWidth) x = clientWidth - explorerWidth;
    if (x < 0) x = 0;
    if (bottomMostPoint > clientHeight) y = clientHeight - explorerHeight;
    if (y < 0) y = 0;

    if (x === explorer.x && y === explorer.y) return;
    dispatch(updatePosition(x, y, explorer.id));
  };

  const onDrop = () => {
    if (!allowDrop) return;
    if (dataTransferArray.tracks.length > 0) {
      setDragCounter(0);
      setDropping(false);
      // Let some time to end the background color transition
      setTimeout(
        () =>
          dispatch(
            setTracksToPlaylist(
              props.explorer.uri,
              dataTransferArray.tracks,
              explorer.id
            )
          ),
        100
      );
    }
  };

  const enableResizing = {
    top: false,
    right: true,
    bottom: true,
    left: false,
    topRight: false,
    bottomRight: true,
    bottomLeft: false,
    topLeft: false
  };

  const getTitle = () => {
    if (!isLogged) return "Sign In";
    if (explorer.title) {
      return explorer.title;
    }
    return "Loading...";
  };

  const renderError = () => {
    return (
      <div
        style={{
          backgroundColor: redError,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 4,
          paddingBottom: 4,
          borderRadius: 8,
          marginBottom: 15
        }}
      >
        <FaExclamationTriangle size={30} color={"white"} />
        <p
          style={{
            marginLeft: 12,
            color: "white",
            fontSize: 13
          }}
          dangerouslySetInnerHTML={{ __html: errorMessage }}
        />
      </div>
    );
  };

  return (
    <div>
      <Rnd
        enableResizing={enableResizing}
        width={explorer.width}
        height={explorer.height}
        default={{
          x: 0,
          y: 0,
          width: explorer.width,
          height: explorer.height
        }}
        position={{ x: explorer.x, y: explorer.y }}
        minWidth={290}
        minHeight={95}
        resizeHandleStyles={{
          right: {
            width: 5
          }
        }}
        maxWidth={window.innerWidth - explorer.x}
        onResize={(e, dir, ref) => {
          if (ref.style.width && ref.style.height) {
            dispatch(
              updateSize(
                Number(
                  ref.style.width.substring(0, ref.style.width.length - 2)
                ),
                Number(
                  ref.style.height.substring(0, ref.style.height.length - 2)
                ),
                explorer.id
              )
            );
          }
        }}
        onDragStop={(e: any, data: DraggableData) => onDragStop(data)}
        enableUserSelectHack
        dragHandleClassName={`${dragHandleClassName}`}
      >
        <div
          className="explorer-handle"
          style={{ position: "absolute", height: "100", width: "100%" }}
        />
        <ExplorerWrapper minimized={explorer.minimized}>
          <TitleBar
            title={getTitle()}
            onMinimize={() => {
              if (explorer.id) dispatch(toggleMinimize(explorer.id));
            }}
            onClose={() => {
              if (explorer.id) dispatch(closeExplorer(explorer.id));
            }}
            playlist={explorer.dropEnabled}
          />
          <ExplorerToolbar id={explorer.id} />
          <ExplorerParameters explorer={explorer} />
          {isLogged ? (
            <ContentContainer
              isDropping={isDropping}
              onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onDrop={onDrop}
              onDragEnter={e => {
                if (!allowDrop) return;
                e.stopPropagation();
                e.preventDefault();
                setDragCounter(dragCounter + 1);
                if (dataTransferArray.tracks.length > 0) setDropping(true);
              }}
              onDragLeave={e => {
                if (!allowDrop) return;
                setDragCounter(dragCounter - 1);
                if (dragCounter === 1) setDropping(false);
              }}
            >
              <ContentWindow explorer={explorer} files={explorer.files} />
            </ContentContainer>
          ) : (
            <ContentContainer>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: "center"
                }}
              >
                <Text>
                  You need to be signed in to a Premium account to access
                  Spotify's library.
                </Text>
                {errorMessage && renderError()}
                <Signin />
              </div>
            </ContentContainer>
          )}
        </ExplorerWrapper>
      </Rnd>
    </div>
  );
};

const ExplorerWrapper = styled.div<{ minimized: boolean }>`
  display: flex;
  flex-direction: column;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
`;

const ContentContainer = styled.div<{ isDropping?: boolean }>`
  display: flex;
  overflow-y: hidden;
  overflow-x: hidden;
  transition: background-color 0.3s;
  background-color: ${props =>
    props.isDropping ? props.theme.explorer.bgDrop : props.theme.explorer.bg};
  height: 100%;
  width: 100%;
`;

const Text = styled.div`
  margin-bottom: 10px;
  text-align: center;
  color: ${props => props.theme.explorer.file.text};
`;
