import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Webamp, * as WebampInstance from "webamp";
import { closeImage } from "../../actions/images";
import { setOnTop } from "../../actions/windows";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { Window, WINDOW_TYPE } from "../../reducers/windows";
import { selectExplorers, selectImages } from "../../selectors/explorer";
import { selectWindows } from "../../selectors/windows";
import SpotifyMedia from "../../spotifymedia";
import { ImageDialogType } from "../../types";
import Explorer from "../Explorer";
import ImageModal from "../ImageDialog";
import WindowInstance from "./WindowInstance";

export default () => {
  const [webampNode, setWebampNode] = useState(null);

  const images = useSelector<AppState, ImageDialogType[]>(selectImages);
  const explorers = useSelector<AppState, SingleExplorerState[]>(
    selectExplorers
  );
  const windows = useSelector<AppState, Window[]>(selectWindows);
  const dataTransferArray = useSelector<AppState, any>(
    state => state.dataTransfer.data
  );

  const dispatch = useDispatch();

  const getWindow = (window: Window, index: number) => {
    switch (window.type) {
      case WINDOW_TYPE.Webamp: {
        if (webampNode) {
          webampNode.style.zIndex = index.toString();
        }
        return null;
      }
      case WINDOW_TYPE.Explorer: {
        const explorer = explorers.find(
          explorerElement => explorerElement.id === window.id
        );
        if (explorer !== undefined)
          return <Explorer key={window.id} explorer={explorer} />;
      }
      case WINDOW_TYPE.Image: {
        const image = images.find(img => img.id === window.id);
        if (image !== undefined)
          return (
            <ImageModal
              key={window.id}
              image={image}
              onDismiss={() => dispatch(closeImage(window.id))}
            />
          );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    const Webamp: any = WebampInstance;
    const webamp: Webamp = new Webamp(
      {
        __initialWindowLayout: {
          main: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150)
            }
          },
          playlist: {
            position: {
              x: Math.floor(window.innerWidth / 2 - 125),
              y: Math.floor(window.innerHeight / 2 - 150 + 116)
            }
          }
        },
        handleTrackDropEvent: () => {
          if (dataTransferArray?.length > 0) {
            try {
              return dataTransferArray;
            } catch (err) {
              // tslint:disable-next-line: no-console
              console.error(err);
            }
          }
          return null;
        },
        __customMediaClass: SpotifyMedia
      },
      {}
    );

    // TODO: Save Webamp to redux state
    webamp.renderWhenReady(document.getElementById("webamp"));

    // tslint:disable-next-line: no-console
    document.addEventListener("load", e => console.log("load:", e));
    document.addEventListener(
      "mousedown",
      (evt: MouseEvent) => {
        // @ts-ignore
        const path = evt.path || (evt.composedPath && evt.composedPath());

        if (path.some((el: HTMLDivElement) => el.id === "webamp")) {
          if (!webampNode) {
            const newNode: HTMLDivElement = path.find(
              (el: HTMLDivElement) => el.id === "webamp"
            );
            setWebampNode(newNode);
          }
          dispatch(setOnTop("webamp"));
        }
      },
      // If the clicked element doesn't have the right selector, bail
      false
    );
  }, []);

  return (
    <>
      {windows.map((window: Window, index) => {
        return (
          <WindowInstance
            key={window.id}
            zIndex={index}
            setOnTop={() => dispatch(setOnTop(window.id))}
          >
            {getWindow(window, index)}
          </WindowInstance>
        );
      })}
    </>
  );
};
