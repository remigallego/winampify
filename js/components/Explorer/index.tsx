import React from "react";
import { connect } from "react-redux";
import { getAlbumCovers } from "../../selectors/explorer";
import { closeImage } from "../../actions/explorer";
import ExplorerWindow from "./ExplorerWindow";
import ImagesModal from "./ImagesModal";
import { AppState } from "../../reducers";

interface StateProps {
  explorers: Array<number>;
  albumCovers: any;
}

interface DispatchProps {
  closeImage: (key: string) => void;
}

type Props = StateProps & DispatchProps;

const Explorer = (props: Props) => {
  return (
    <div>
      {props.explorers.map(explorerId => (
        <ExplorerWindow key={explorerId} explorerId={explorerId} />
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

const mapStateToProps = (state: AppState): StateProps => ({
  albumCovers: getAlbumCovers(state),
  explorers: state.explorer.allIds
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  closeImage: (key: string) => dispatch(closeImage(key))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer);
