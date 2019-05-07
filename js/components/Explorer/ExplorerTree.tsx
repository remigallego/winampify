import React from "react";
import { connect } from "react-redux";

import {
  createNewExplorer,
  ACTION_TYPE,
  setItems
} from "../../actions/explorer";
import hearts from "./images/hearts.ico";
import harddrive from "./images/7.ico";
import newexplorer from "./images/319.ico";
import recentdocuments from "./images/recentdocuments.png";
import star from "./images/star.ico";
import { ExplorerTreeStyle } from "./styles";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "../../reducers";
import { SingleExplorerState } from "../../reducers/explorer";

interface DispatchProps {
  setItems(actionType: ACTION_TYPE, uri?: string): void;
  createNewExplorer(): void;
}

interface OwnProps {
  explorer: SingleExplorerState;
}

type Props = OwnProps & DispatchProps;

class ExplorerTree extends React.Component<Props> {
  render() {
    const {
      explorerTree,
      explorerTreeText,
      explorerTreeIcon
    } = ExplorerTreeStyle;
    return (
      <div
        className="explorer-tree"
        style={explorerTree}
        onMouseDown={e => e.preventDefault()}
      >
        <div
          className="explorer-tree-text"
          onClick={() => this.props.setItems(ACTION_TYPE.TOP)}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={hearts}
          />
          My Top Artists
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.setItems(ACTION_TYPE.FOLLOWING)}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={star}
          />
          Following
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.setItems(ACTION_TYPE.RECENTLY_PLAYED)}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={recentdocuments}
          />
          Recently Played
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.setItems(ACTION_TYPE.LIBRARY_ALBUMS)}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={harddrive}
          />
          My Saved Albums
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.setItems(ACTION_TYPE.LIBRARY_TRACKS)}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={harddrive}
          />
          My Saved Tracks
        </div>
        <div
          className="explorer-tree-text"
          id="disallow-on-top"
          onClick={() => this.props.createNewExplorer()}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={newexplorer}
          />
          New Explorer
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, null, Action>,
  ownProps: OwnProps
): DispatchProps => {
  const { id: explorerId } = ownProps.explorer;
  return {
    setItems: (actionType: ACTION_TYPE, uri?: string) =>
      dispatch(setItems(actionType, uri, explorerId)),
    createNewExplorer: () => dispatch(createNewExplorer())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(ExplorerTree);
