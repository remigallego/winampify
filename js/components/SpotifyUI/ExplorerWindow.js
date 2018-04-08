import React from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import $ from "jquery";

import {
  goPreviousView,
  viewAlbumsFromArtist,
  viewTracksFromAlbum,
  unsetFocusExplorer,
  playTrackFromExplorer,
  searchOnSpotify
} from "../../actionCreators";
import { SET_SELECTED_EXPLORER } from "../../actionTypes";
import magnifier from "./images/magnifier.png";
import backButton from "./images/Back.png";
import ExplorerTree from "./ExplorerTree";
import ExplorerContent from "./ExplorerContent";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

class ExplorerWindow extends React.Component {
  componentDidMount() {
    $(".explorer-toolbar-backbutton")
      .attr("unselectable", "on")
      .css({
        "-moz-user-select": "-moz-none",
        "-o-user-select": "none",
        "-khtml-user-select": "none" /* you could also put this in a class */,
        "-webkit-user-select": "none" /* and add the CSS class here instead */,
        "-ms-user-select": "none",
        "user-select": "none"
      })
      .bind("selectstart", () => {
        return false;
      });
  }

  goBack() {
    this.props.goPreviousView();
  }

  render() {
    return (
      <Draggable
        axis="both"
        bounds="html"
        handle=".explorer-title"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div className="explorer-window">
          <div className="explorer-title">
            <img src={magnifier} />
            <p>Winampify</p>
          </div>
          <div className="explorer-toolbar">
            <img
              className="explorer-toolbar-backbutton"
              src={backButton}
              onClick={() => this.goBack()}
            />
            <form
              className="explorer-toolbar-searchbox"
              onSubmit={e => {
                e.preventDefault();
                this.props.searchOnSpotify(e.target[0].value);
              }}
            >
              <input />
            </form>
          </div>
          <div className="explorer-mainview">
            <ExplorerTree />
            <ExplorerContent />
          </div>
          <div className="explorer-foot" />
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = state => ({
  playlist: state.playlist,
  explorer: state.explorer
});

const mapDispatchToProps = dispatch => ({
  click: id => {
    dispatch({ type: SET_SELECTED_EXPLORER, selected: id });
  },
  playTrack: id => {
    dispatch(playTrackFromExplorer(id));
  },
  viewAlbumsFromArtist: artist => dispatch(viewAlbumsFromArtist(artist)),
  viewTracksFromAlbum: album => dispatch(viewTracksFromAlbum(album)),
  goPreviousView: () => dispatch(goPreviousView()),
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer()),
  searchOnSpotify: search => dispatch(searchOnSpotify(search))
});
ExplorerWindow = DragDropContext(HTML5Backend)(ExplorerWindow);
export default connect(mapStateToProps, mapDispatchToProps)(ExplorerWindow);
