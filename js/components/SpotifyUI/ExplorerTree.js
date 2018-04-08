import React from "react";
import { connect } from "react-redux";

import {
  viewMyTopArtists,
  viewMyFollowedArtists,
  viewMyRecentlyPlayed
} from "../../actionCreators";
import hearts from "./images/hearts.ico";
import recentdocuments from "./images/recentdocuments.png";

class ExplorerTree extends React.Component {
  componentDidMount() {
    this.props.viewMyTopArtists();
  }
  render() {
    return (
      <div className="explorer-tree">
        <div
          className="explorer-tree-text"
          onClick={() => this.props.viewMyTopArtists()}
        >
          <img className="explorer-tree-icon" src={hearts} />My Top Artists
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.viewMyFollowedArtists()}
        >
          <img className="explorer-tree-icon" src={hearts} />Following
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.viewMyRecentlyPlayed()}
        >
          <img className="explorer-tree-icon" src={recentdocuments} />
          Recently Played
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  explorer: state.explorer
});

const mapDispatchToProps = dispatch => ({
  viewMyTopArtists: () => dispatch(viewMyTopArtists()),
  viewMyFollowedArtists: () => dispatch(viewMyFollowedArtists()),
  viewMyRecentlyPlayed: () => dispatch(viewMyRecentlyPlayed())
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerTree);
