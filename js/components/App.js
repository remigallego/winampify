import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Explorer from "./Explorer";
import "../../css/react-context-menu.css";
import "../../css/winamp.css";
import ImageModal from "./ImageModal";
import Desktop from "./Desktop";
import WinampApp from "./WinampApp";

const App = ({ images, closeModal }) => {
  const renderImages = () => {
    return images.map(image => {
      console.log(image);
      return <ImageModal image={image} onClick={() => closeModal()} />;
    });
  };
  console.log(
    "frdsjkhfdsjkhfdskfdshkjfdshjkfsdhjkfdshkjfdshjkdfshjkhdfjskhjfksdkhjfsdhkj"
  );
  return (
    <div role="application">
      <WinampApp />
      <Desktop />
      <Explorer />
      {renderImages()}
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
  images: state.display.albumCovers
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
