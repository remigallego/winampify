import React from "react";
import Draggable from "react-draggable";
import { connect } from "react-redux";
import $ from "jquery";

import {
  viewAlbumsFromArtist,
  viewTracksFromAlbum,
  unsetFocusExplorer,
  playTrackFromExplorer,
  searchOnSpotify
} from "../../actionCreators";
import { SET_SELECTED_EXPLORER } from "../../actionTypes";
import { ExplorerWindowStyle } from "./styles.js";
import magnifier from "./images/magnifier.png";
import backButton from "./images/Back.png";
import ExplorerTree from "./ExplorerTree";
import ExplorerContent from "./ExplorerContent";
class ExplorerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    };
  }
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

    // width
    window.addEventListener("resize", () => this.setWidthAndHeight());
    this.setWidthAndHeight();
  }

  setWidthAndHeight() {
    this.setState({ width: this.getDocWidth() / 2.8 }); // best is 2.8
    this.setState({ height: this.getDocHeight() / 1.8 });
  }

  getDocHeight() {
    const D = document;
    return Math.max(
      D.body.scrollHeight,
      D.documentElement.scrollHeight,
      D.body.offsetHeight,
      D.documentElement.offsetHeight,
      D.body.clientHeight,
      D.documentElement.clientHeight
    );
  }
  getDocWidth() {
    return Math.max(
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
      document.documentElement.offsetWidth
    );
  }

  goBack() {
    // TODO
  }

  render() {
    const {
      windowStyle,
      explorerTitle,
      explorerTitleImg,
      explorerTitleP,
      explorerToolbar,
      backButtonStyle,
      explorerWrapper,
      searchbox,
      input,
      mainView
    } = ExplorerWindowStyle;

    windowStyle.height = this.state.height;
    windowStyle.width = this.state.width;
    return (
      <Draggable
        axis="both"
        bounds="html"
        handle=".explorer-title"
        defaultPosition={{ x: 100, y: 200 }}
        position={null}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div className="explorer-window" style={windowStyle}>
          <div className="explorer-wrapper" style={explorerWrapper}>
            <div className="explorer-title" style={explorerTitle}>
              <img src={magnifier} style={explorerTitleImg} />
              <p style={explorerTitleP}>Winampify</p>
            </div>
            <div
              className="explorer-toolbar"
              style={explorerToolbar}
              onMouseDown={e => e.preventDefault()}
            >
              <img
                className="explorer-toolbar-backbutton"
                src={backButton}
                style={backButtonStyle}
                onClick={() => this.goBack()}
              />
              <form
                className="explorer-toolbar-searchbox"
                style={searchbox}
                onSubmit={e => {
                  e.preventDefault();
                  this.props.searchOnSpotify(e.target[0].value);
                }}
              >
                <input />
              </form>
            </div>
            <div className="explorer-mainview" style={mainView}>
              <ExplorerTree />
              <ExplorerContent />
            </div>
          </div>
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
  unsetFocusExplorer: () => dispatch(unsetFocusExplorer()),
  searchOnSpotify: search => dispatch(searchOnSpotify(search))
});
export default connect(mapStateToProps, mapDispatchToProps)(ExplorerWindow);
