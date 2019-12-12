import React from "react";
import { useDispatch } from "react-redux";
import Rnd, { DraggableData } from "react-rnd";
import {
  updatePosition,
  updateSize,
  closeExplorer
} from "../../actions/explorer";
import { SingleExplorerState } from "../../reducers/explorer";
import "./animations.css";
import ContentWindow from "./ContentWindow";
import TitleBar from "./TitleBar";
import ExplorerToolbar from "./Toolbar";
import { dragHandleClassName } from "./vars";
import styled from "styled-components";

interface Props {
  explorer: SingleExplorerState;
}

export default (props: Props) => {
  const { explorer } = props;
  const dispatch = useDispatch();

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

    dispatch(updatePosition(x, y, explorer.id));
  };

  const dispatchResize = (e: any, d: any, ref: HTMLDivElement) => {
    if (ref.style.width && ref.style.height) {
      dispatch(
        updateSize(
          Number(ref.style.width.substring(0, ref.style.width.length - 2)),
          Number(ref.style.height.substring(0, ref.style.height.length - 2)),
          explorer.id
        )
      );
    }
  };

  return (
    <div>
      <Rnd
        enableResizing={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
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
            onClose={() => explorer.id && dispatch(closeExplorer(explorer.id))}
          />
          <ExplorerToolbar id={explorer.id} />
          <ContentContainer>
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

const ContentContainer = styled.div`
  display: flex;
  overflow: auto;
  background-color: white;
  height: 100%;
  width: 100%;
`;
