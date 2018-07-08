import React from "react";
import { connect } from "react-redux";

import {
  viewMyTopArtists,
  viewMyFollowedArtists,
  viewMyRecentlyPlayed,
  viewMyLibraryAlbums,
  viewMyLibraryTracks
} from "../../actions/explorer";
import hearts from "./images/hearts.ico";
import harddrive from "./images/7.ico";
import recentdocuments from "./images/recentdocuments.png";
import star from "./images/star.ico";
import { ExplorerTreeStyle } from "./styles.js";
class ExplorerTree extends React.Component {
  componentDidMount() {
    this.props.viewMyTopArtists();
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
          onClick={() => this.props.viewMyTopArtists()}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={hearts}
          />My Top Artists
        </div>
        <div
          className="explorer-tree-text"
          onClick={() => this.props.viewMyFollowedArtists()}
          style={explorerTreeText}
        >
          <img
            className="explorer-tree-icon"
            style={explorerTreeIcon}
            src={star}
          />Following
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
  viewMyRecentlyPlayed: () => dispatch(viewMyRecentlyPlayed()),
  viewMyLibraryAlbums: () => dispatch(viewMyLibraryAlbums()),
  viewMyLibraryTracks: () => dispatch(viewMyLibraryTracks())
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerTree);
