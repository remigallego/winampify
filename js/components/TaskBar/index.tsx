import React, { FunctionComponent, useState } from "react";
import { FaFolder, FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { TrackInfo } from "webamp";
import { setOnTop, toggleMinimize } from "../../actions/windows";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { Window, WINDOW_TYPE } from "../../reducers/windows";
import { selectExplorers, selectImages } from "../../selectors/explorer";
import { blueDrop, blueTitleBar, blueTitleBarDark } from "../../styles/colors";
import { findHighestPosition } from "../../utils/windows";
import ImgCached from "../Reusables/ImgCached";
import winampIcon from "./winamp-icon.png";
import useInterval from "@use-it/interval";

const TaskBar: FunctionComponent = props => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const explorers = useSelector<AppState, SingleExplorerState[]>(
    selectExplorers
  );
  const images = useSelector(selectImages);
  const windows = useSelector((state: AppState) => state.windows.windows);
  const trackInfo = useSelector((x: AppState) => x.webamp.currentTrack);

  const windowOnTop = windows.find(
    w => w.position === findHighestPosition(windows)
  );

  const dispatch = useDispatch();

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  const renderExplorer = (w: Window) => {
    const exp = explorers.find(_exp => _exp.id === w.id);
    const otherWindowOnTop = windows
      .filter(win => win.id !== w.id)
      .find(
        win =>
          win.position ===
          findHighestPosition(windows.filter(win => win.id !== w.id))
      );

    return (
      <Item
        minimized={w.minimized}
        onClick={() => {
          dispatch(toggleMinimize(w.id));

          // TODO: This needs to go in the minimize action!

          if (!w.minimized) {
            if (windowOnTop.id === w.id) {
              if (otherWindowOnTop) {
                dispatch(setOnTop(otherWindowOnTop.id));
              }
            }
          } else {
            dispatch(setOnTop(w.id));
          }
        }}
      >
        <IconFolder></IconFolder>
        <Text>{exp?.title ?? "-"}</Text>
      </Item>
    );
  };

  const renderWinamp = (w: Window, t: TrackInfo) => {
    const otherWindowOnTop = windows
      .filter(win => win.id !== w.id)
      .find(
        win =>
          win.position ===
          findHighestPosition(windows.filter(win => win.id !== w.id))
      );
    const titleString = t
      ? `${t.metaData.artist} - ${t.metaData.title}`
      : "Winamp";
    return (
      <Item
        minimized={w.minimized}
        onClick={() => {
          dispatch(toggleMinimize(w.id));

          if (!w.minimized) {
            if (windowOnTop.id === w.id) {
              if (otherWindowOnTop) {
                dispatch(setOnTop(otherWindowOnTop.id));
              }
            }
          } else {
            dispatch(setOnTop(w.id));
          }
        }}
      >
        <ImgCached
          src={winampIcon}
          style={{
            width: 17,
            height: 17,
            marginRight: 4
          }}
        />
        <Text id="winamp-title">{titleString}</Text>
      </Item>
    );
  };

  const renderImage = (w: Window) => {
    const otherWindowOnTop = windows
      .filter(win => win.id !== w.id)
      .find(
        win =>
          win.position ===
          findHighestPosition(windows.filter(win => win.id !== w.id))
      );
    const image = images.find(img => img.id === w.id);
    return (
      <Item
        minimized={w.minimized}
        onClick={() => {
          dispatch(toggleMinimize(w.id));

          if (!w.minimized) {
            if (windowOnTop.id === w.id) {
              if (otherWindowOnTop) {
                dispatch(setOnTop(otherWindowOnTop.id));
              }
            }
          } else {
            dispatch(setOnTop(w.id));
          }
        }}
      >
        <ImgCached
          src={image.source}
          style={{
            marginRight: 4
          }}
          cachedSize={{
            w: 20,
            h: 20
          }}
        />
        <Text>{image.title}</Text>
      </Item>
    );
  };

  return (
    <Container>
      <WindowsContainer>
        {windows.map(window => {
          if (window.type === WINDOW_TYPE.Explorer) {
            return renderExplorer(window);
          }
          if (window.type === WINDOW_TYPE.Webamp) {
            return renderWinamp(window, trackInfo);
          }
          if (window.type === WINDOW_TYPE.Image) {
            return renderImage(window);
          }
        })}
      </WindowsContainer>
      <InfosContainer>
        <DateText>{currentTime.toLocaleString()}</DateText>
      </InfosContainer>
    </Container>
  );
};

export default TaskBar;

const Container = styled.div`
  border-top: 1px solid grey;
  background-color: #0d0a29;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
`;

const WindowsContainer = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const InfosContainer = styled.div`
  height: 100%;
  width: 200;
  background-color: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const DateText = styled.h1`
  font-size: 12px;
  color: white;
`;

const Item = styled.div<{
  minimized: boolean;
}>`
  width: 100px;
  padding: 0px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  background-color: ${props => (!props.minimized ? "black" : blueTitleBarDark)};
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

const Text = styled.div`
  text-overflow: ellipsis;
  text-align: center;
  font-size: 12px;
  color: white;
  overflow: hidden;
  white-space: nowrap;
`;

const IconFolder = styled(FaFolder)`
  width: 14px;
  height: 14px;
  fill: ${props => props.theme.folder.color};
  margin-right: 4px;
`;
