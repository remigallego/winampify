import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as $ from "jquery";

import WindowManager from "./WindowManager";
import MainWindow from "./MainWindow";
import PlaylistWindow from "./PlaylistWindow";
import EqualizerWindow from "./EqualizerWindow";
import AvsWindow from "./AvsWindow";
import Skin from "./Skin";
import SpotifyWebPlaybackAPI from "./SpotifyWebPlaybackAPI";
import SpotifyUI from "./SpotifyUI";
import "../../css/winamp.css";
import ImageModal from "./ImageModal";
const genWindowMap = {
  AVS_WINDOW: AvsWindow
};

const GEN_WINDOWS = ["AVS_WINDOW"];

const App = ({
  media,
  closed,
  equalizer,
  playlist,
  openWindows,
  container,
  filePickers,
  isModalOpen,
  imageSource,
  closeModal
}) => {
  if (closed) {
    return null;
  }

  const componentWillMount = () => {
    $.fn.extend({
      disableSelection: function() {
        this.each(function() {
          if (typeof this.onselectstart != "undefined") {
            this.onselectstart = function() {
              return false;
            };
          } else if (typeof this.style.MozUserSelect != "undefined") {
            this.style.MozUserSelect = "none";
          } else {
            this.onmousedown = function() {
              return false;
            };
          }
        });
      }
    });
    $(document).ready(function() {
      $("*").disableSelection();
    });
  };
  const windows = {
    main: <MainWindow mediaPlayer={media} filePickers={filePickers} />,
    equalizer: equalizer && <EqualizerWindow />,
    playlist: playlist && <PlaylistWindow />
  };
  // Add any "generic" windows
  GEN_WINDOWS.forEach((windowId, i) => {
    const Component = genWindowMap[windowId];
    windows[`genWindow${i}`] = openWindows.has(windowId) && (
      <Component key={i} />
    );
  });
  return (
    <div role="application" id="winamp2-js">
      <Skin />
      <WindowManager windows={windows} container={container} />
      <SpotifyWebPlaybackAPI />
      <SpotifyUI />
      {isModalOpen && (
        <ImageModal image={imageSource} onClick={() => closeModal()} />
      )}
    </div>
  );
};

App.propTypes = {
  container: PropTypes.instanceOf(Element)
};
const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch({ type: "CLOSE_MODAL" });
  }
});

const mapStateToProps = state => ({
  closed: state.display.closed,
  equalizer: state.windows.equalizer,
  playlist: state.windows.playlist,
  openWindows: new Set(state.windows.openGenWindows),
  isModalOpen: state.display.isModalOpen,
  imageSource: state.display.imageSource
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
