import React from "react";
import { connect } from "react-redux";
import { getAlbumCovers } from "../../selectors/explorer";
import { closeImage } from "../../actions/explorer";
import ExplorerWindow from "./ExplorerWindow";
import ImagesModal from "./ImagesModal";

const Explorer = props => {
  return (
    <div>
      <ExplorerWindow />
      {Object.keys(props.albumCovers).map(key => (
        <ImagesModal
          key={key}
          image={props.albumCovers[key]}
          onDismiss={() => props.closeImage(key)}
        />
      ))}
    </div>
  );
};

const mapStateToProps = state => ({
  albumCovers: getAlbumCovers(state)
});

const mapDispatchToProps = dispatch => ({
  closeImage: id => dispatch(closeImage(id))
});
export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
