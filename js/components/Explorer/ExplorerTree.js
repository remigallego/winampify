import React from "react";
import { connect } from "react-redux";

import {
  setMyTopArtists,
  setMyFollowedArtists,
  viewMyRecentlyPlayed,
  viewMyLibraryAlbums,
  viewMyLibraryTracks,
  createNewExplorer
} from "../../actions/explorer";
import hearts from "./images/hearts.ico";
import harddrive from "./images/7.ico";
import newexplorer from "./images/319.ico";
import recentdocuments from "./images/recentdocuments.png";
import star from "./images/star.ico";
import { ExplorerTreeStyle } from "./styles.js";
class ExplorerTree extends React.Component {
  componentDidMount() {
    this.props.setMyTopArtists();
  }
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
          onClick={() => this.props.setMyTopArtists()}
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
          onClick={() => this.props.setMyFollowedArtists()}
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
          onClick={() => this.props.viewMyRecentlyPlayed()}
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
          onClick={() => this.props.viewMyLibraryAlbums()}
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
          onClick={() => this.props.viewMyLibraryTracks()}
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  setMyTopArtists: () => dispatch(setMyTopArtists(ownProps.explorerId)),
  setMyFollowedArtists: () =>
    dispatch(setMyFollowedArtists(ownProps.explorerId)),
  viewMyRecentlyPlayed: () =>
    dispatch(viewMyRecentlyPlayed(ownProps.explorerId)),
  viewMyLibraryAlbums: () => dispatch(viewMyLibraryAlbums(ownProps.explorerId)),
  viewMyLibraryTracks: () => dispatch(viewMyLibraryTracks(ownProps.explorerId)),
  createNewExplorer: () => dispatch(createNewExplorer())
});

export default connect(
  null,
  mapDispatchToProps
)(ExplorerTree);
