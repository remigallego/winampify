import React from "react";
import { connect } from "react-redux";
import { getImages } from "../../selectors/explorer";
import { closeImage } from "../../actions/explorer";
import ExplorerWindow from "./ExplorerWindow";
import ImagesModal from "./ImagesModal";
import { AppState } from "../../reducers";
import { Image } from "../../types";

interface StateProps {
  explorers: Array<number>;
  images: Array<Image>;
}

interface DispatchProps {
  closeImage: (key: string) => void;
}

type Props = StateProps & DispatchProps;

const Explorer = (props: Props) => {
  console.log("props.images", props.images);
  return (
    <div>
      {props.explorers.map(explorerId => (
        <ExplorerWindow key={explorerId} explorerId={explorerId} />
      ))}
      {props.images.map((image, index) => (
        <ImagesModal
          key={index}
          image={props.images[index]}
          onDismiss={() => props.closeImage(image.id)}
        />
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  images: getImages(state),
  explorers: state.explorer.allIds
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  closeImage: (key: string) => dispatch(closeImage(key))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer);
