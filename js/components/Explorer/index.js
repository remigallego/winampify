import React from "react";
import { connect } from "react-redux";
import { getAlbumCovers, getExplorers } from "../../selectors/explorer";
import { closeImage } from "../../actions/explorer";
import ExplorerWindow from "./ExplorerWindow";
import ImagesModal from "./ImagesModal";

const Explorer = props => {
  return (
    <div>
      {props.explorers.map(explorerId => (
        <ExplorerWindow explorerId={explorerId} />
      ))}
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
  albumCovers: getAlbumCovers(state),
  explorers: state.explorer.allIds
});

const mapDispatchToProps = dispatch => ({
  closeImage: id => dispatch(closeImage(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer);
