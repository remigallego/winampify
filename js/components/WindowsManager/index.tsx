import React from "react";
import { connect } from "react-redux";
import { WINDOW_TYPE, Window } from "../../reducers/windows";
import ImageModal from "../Explorer/ImageModal";
import Explorer from "../Explorer";
import { ImageModalType } from "../../types";
import { selectImages, selectExplorers } from "../../selectors/explorer";
import { selectWindows } from "../../selectors/windows";
import { AppState } from "../../reducers";
import { closeImage } from "../../actions/images";
import { createNewExplorer, ACTION_TYPE, setItems } from "../../actions/explorer";
import { setOnTop } from "../../actions/windows";
import WindowInstance from "./WindowInstance";
import * as WebampInstance from "../../../webamp/built/webamp.bundle";
import SpotifyMedia from "../../spotifymedia";
import { SingleExplorerState } from "../../reducers/explorer";

interface StateProps {
  explorers: Array<SingleExplorerState>;
  images: Array<ImageModalType>;
  windows: Array<Window>;
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
          explorer => explorer.id === window.id
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
        handleTrackDropEvent: (e: React.DragEvent<HTMLDivElement>) => {
          if (e.dataTransfer.getData("tracks").length > 0) {
            const json = e.dataTransfer.getData("tracks");
            try {
              return JSON.parse(json);
            } catch (err) {}
          }
          return null;
        },
        __customMediaClass: SpotifyMedia
      },
      {}
    );

    webamp.renderWhenReady(document.getElementById("webamp")).then();
    document.addEventListener("load", e => console.log("load:", e));
    document.addEventListener(
      "mousedown",
      (evt: MouseEvent) => {
        if (
          (evt as any).path.some((el: HTMLDivElement) => el.id === "webamp")
        ) {
          if (!this.webampNode) {
            const webampNode: HTMLDivElement = (evt as any).path.find(
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
