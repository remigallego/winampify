import React from "react";
import { connect } from "react-redux";
import * as WebampInstance from "webamp";
import { createNewExplorer, setItems } from "../../actions/explorer";
import { closeImage } from "../../actions/images";
import { setOnTop } from "../../actions/windows";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";
import { Window, WINDOW_TYPE } from "../../reducers/windows";
import { selectExplorers, selectImages } from "../../selectors/explorer";
import { selectWindows } from "../../selectors/windows";
import SpotifyMedia from "../../spotifymedia";
import { ACTION_TYPE, ImageDialogType } from "../../types";
import Explorer from "../Explorer";
import ImageModal from "../ImageDialog";
import WindowInstance from "./WindowInstance";

interface StateProps {
  explorers: SingleExplorerState[];
  images: ImageDialogType[];
  windows: Window[];
}

interface DispatchProps {
  closeImage: (key: string) => void;
  createNewExplorer: () => void;
  setItems: (actionType: ACTION_TYPE) => void;
  setOnTop: (id: string) => void;
}

type Props = StateProps & DispatchProps;

class WindowsManager extends React.Component<Props, {}> {
  webampNode!: HTMLDivElement;

  getWindow(window: Window, index: number) {
    switch (window.type) {
      case WINDOW_TYPE.Webamp: {
        if (this.webampNode) {
          this.webampNode.style.zIndex = index.toString();
        }
        return null;
      }
      case WINDOW_TYPE.Explorer: {
        const explorer = this.props.explorers.find(
          explorerElement => explorerElement.id === window.id
        );
        if (explorer !== undefined)
          return <Explorer key={window.id} explorer={explorer} />;
      }
      case WINDOW_TYPE.Image: {
        const image = this.props.images.find(img => img.id === window.id);
        if (image !== undefined)
          return (
            <ImageModal
              key={window.id}
              image={image}
              onDismiss={() => this.props.closeImage(window.id)}
            />
          );
      }
      default:
        return null;
    }
  }

  componentDidMount() {
    const Webamp: any = WebampInstance;
    const webamp = new Webamp(
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
        handleTrackDropEvent: (e: React.DragEvent<HTMLDivElement>) => {
          if (
            window.dataTransferObject &&
            window.dataTransferObject.length > 0
          ) {
            const json = window.dataTransferObject;
            try {
              return JSON.parse(window.dataTransferObject);
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

    webamp.renderWhenReady(document.getElementById("webamp"));

    // tslint:disable-next-line: no-console
    document.addEventListener("load", e => console.log("load:", e));
    document.addEventListener(
      "mousedown",
      (evt: MouseEvent) => {
        // @ts-ignore
        const path = evt.path || (evt.composedPath && evt.composedPath());

        if (path.some((el: HTMLDivElement) => el.id === "webamp")) {
          if (!this.webampNode) {
            const webampNode: HTMLDivElement = path.find(
              (el: HTMLDivElement) => el.id === "webamp"
            );
            this.webampNode = webampNode;
          }
          this.props.setOnTop("webamp");
        }
      },
      // If the clicked element doesn't have the right selector, bail
      false
    );
  }
  render() {
    return (
      <>
        {this.props.windows.map((window: Window, index) => {
          return (
            <WindowInstance
              key={window.id}
              zIndex={index}
              setOnTop={() => this.props.setOnTop(window.id)}
            >
              {this.getWindow(window, index)}
            </WindowInstance>
          );
        })}
      </>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  images: selectImages(state),
  explorers: selectExplorers(state),
  windows: selectWindows(state)
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  closeImage: (key: string) => dispatch(closeImage(key)),
  createNewExplorer: () => dispatch(createNewExplorer()),
  setItems: (actionType: ACTION_TYPE) => dispatch(setItems(actionType)),
  setOnTop: id => dispatch(setOnTop(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WindowsManager);
