import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MainWindow from "./MainWindow";
import PlaylistWindow from "./PlaylistWindow";
import Skin from "./Skin";
import "../../../css/winamp.css";
import WindowManager from "./WindowManager";

const WinampApp = ({ media, closed, playlist, container, filePickers }) => {
  if (closed) {
    return null;
  }

  const windows = {
    main: <MainWindow mediaPlayer={media} filePickers={filePickers} />,
    playlist: playlist && <PlaylistWindow />
  };

  return (
    <div role="application" id="winamp2-js">
      <Skin />
      <WindowManager windows={windows} container={container} />
    </div>
  );
};

WinampApp.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(WinampApp);
