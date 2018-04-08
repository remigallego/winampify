import React from "react";
import Script from "react-load-script";
import { connect } from "react-redux";

import {
  createPlayerObject,
  removeAllTracks,
  addTrackFromURI,
  addTracksFromPlaylist
} from "../actionCreators.js";

class SpotifyWebPlaybackAPI extends React.Component {
  constructor(props) {
    super(props);
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.state = {
      input: "spotify:user:remifasol:playlist:43uS6JpETpdcZxTtK7cxCR"
    };
  }

  handleScriptLoad() {}

  handleScriptError(e) {
    console.log(e);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ input: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.addTracksFromPlaylist(e.target[0].value);
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({
  getOAuthToken: state.media.getOAuthToken,
  id: state.media.id
});

const mapDispatchToProps = {
  createPlayerObject,
  removeAllTracks,
  addTrackFromURI,
  addTracksFromPlaylist,
  ready: () => {
    dispatch({ type: "READY" });
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SpotifyWebPlaybackAPI
);
