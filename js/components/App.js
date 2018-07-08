import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Explorer from "./Explorer";
import "../../css/winamp.css";
import ImageModal from "./ImageModal";
import Desktop from "./Desktop";
import WinampApp from "./WinampApp";

const App = ({ isModalOpen, imageSource, closeModal }) => {
  return (
    <div role="application" id="winamp2-js">
      <WinampApp />
      <Desktop />
      <Explorer />
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
  isModalOpen: state.display.isModalOpen,
  imageSource: state.display.imageSource
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
