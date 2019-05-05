import React from "react";
import { connect } from "react-redux";
import { WINDOW_TYPE, Window } from "../reducers/windows";
import ImageModal from "./Explorer/ImageModal";
import Explorer from "./Explorer";
import { Image } from "../types";
import { selectImages } from "../selectors/explorer";
import { getWindows } from "../selectors/windows";
import { AppState } from "../reducers";
import { closeImage } from "../actions/images";
import { createNewExplorer, ACTION_TYPE, setItems } from "../actions/explorer";
import { setOnTop } from "../actions/windows";
import WindowInstance from "./WindowInstance";
import * as WebampInstance from "../../webamp/built/webamp.bundle";
import SpotifyMedia from "../spotifymedia";

interface StateProps {
  explorersIds: Array<string>;
  images: Array<Image>;
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
  getWindow(window: Window, index: number) {
    switch (window.type) {
      case WINDOW_TYPE.Webamp:
        return (
          <div id="window-instance-webamp">
            <div key={window.id} zindex={index * 5} id="winamp-container" />
          </div>
        );
      case WINDOW_TYPE.Explorer:
        return (
          <Explorer key={window.id} explorerId={window.id} zIndex={index * 5} />
        );
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
        handleTrackDropEvent: e => {
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

    webamp.renderWhenReady(document.getElementById("winamp-container"));

    document.addEventListener(
      "click",
      evt => {
        if (evt.path.some(el => el.id === "winamp-container")) {
          this.props.setOnTop("winamp-container");
        }
        // If the clicked element doesn't have the right selector, bail
      },
      false
    );
    // this.props.createNewExplorer();
    // this.props.setItems(ACTION_TYPE.RECENTLY_PLAYED);
  }
  render() {
    return (
      <>
        {this.props.windows.map((window: Window, index) => {
          return (
            <WindowInstance
              className={"instance-window"}
              key={window.id}
              zIndex={index * 10000}
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
  explorersIds: state.explorer.allIds,
  windows: getWindows(state)
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
