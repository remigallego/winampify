import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rnd, { DraggableData } from "react-rnd";
import styled from "styled-components";
import {
  closeExplorer,
  setTracksToPlaylist,
  updatePosition,
  updateSize
} from "../../actions/explorer";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { Window } from "../../reducers/windows";
import { selectWindows } from "../../selectors/windows";
import { blueDrop } from "../../styles/colors";
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
  const [scrollPos, setScrollPos] = useState(0);
  const [ref, setRef] = useState(null);
  const [backgroundColor, setBackground] = useState("white");
  const [dragCounter, setDragCounter] = useState(0);
  const [scrollUpdated, setScrollUpdated] = useState(false);
  const windows = useSelector<AppState, Window[]>(selectWindows);
  const dataTransferArray = useSelector(
    (state: AppState) => state.dataTransfer
  );
  const dispatch = useDispatch();

  const isExplorerOnFocus =
    windows.map(w => w.id).indexOf(explorer.id) === windows.length - 1;

  useEffect(() => {
    const goingOutOfFocus = !isExplorerOnFocus && scrollUpdated;
    const goingIntoFocus = ref && isExplorerOnFocus && !scrollUpdated;
    if (goingOutOfFocus) setScrollUpdated(false);
    if (goingIntoFocus) {
      ref.scrollTop = scrollPos;
      setScrollUpdated(true);
    }
  });

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

  const dispatchResize = (e: any, d: any, r: HTMLDivElement) => {
    if (r.style.width && r.style.height) {
      dispatch(
        updateSize(
          Number(r.style.width.substring(0, r.style.width.length - 2)),
          Number(r.style.height.substring(0, r.style.height.length - 2)),
          explorer.id
        )
      );
    }
  };

  const onDrop = () => {
    if (!allowDrop) return;
    if (dataTransferArray.tracks.length > 0) {
      setDragCounter(0);
      setBackground("white");
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

  const allowDrop =
    explorer.dropEnabled && dataTransferArray.source !== props.explorer.id;

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
        maxWidth={window.innerWidth - explorer.x}
        onResizeStop={dispatchResize}
        onDragStop={(e: any, data: DraggableData) => onDragStop(data)}
        // @ts-ignore
        enableUserSelectHack
        dragHandleClassName={`.${dragHandleClassName}`}
      >
        <div
          className="explorer-handle"
          style={{ position: "absolute", height: "100", width: "100%" }}
        />
        <ExplorerWrapper>
          <TitleBar
            title={explorer.title || "Loading..."}
            onClose={() => {
              if (explorer.id) dispatch(closeExplorer(explorer.id));
            }}
            playlist={explorer.dropEnabled}
          />
          <ExplorerToolbar id={explorer.id} />
          {/* <ExplorerParameters explorer={explorer} /> */}
          <ContentContainer
            ref={r => {
              if (r) setRef(r);
            }}
            onScroll={e => setScrollPos((e.target as HTMLDivElement).scrollTop)}
            backgroundColor={backgroundColor}
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
              if (dataTransferArray.tracks.length > 0) setBackground(blueDrop);
            }}
            onDragLeave={e => {
              if (!allowDrop) return;
              setDragCounter(dragCounter - 1);
              if (dragCounter === 1) setBackground("white");
            }}
          >
            <ContentWindow explorer={explorer} files={explorer.files} />
          </ContentContainer>
        </ExplorerWrapper>
      </Rnd>
    </div>
  );
};

const ExplorerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
`;

const ContentContainer = styled.div<{ backgroundColor: string }>`
  display: flex;
  overflow: auto;
  transition: background-color 0.3s;
  background-color: ${props => props.backgroundColor};
  height: 100%;
  width: 100%;
`;
