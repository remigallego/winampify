import React from "react";
import { connect } from "react-redux";

import PlaylistMenu from "./PlaylistMenu";

const el = document.createElement("input");
el.type = "file";

/* eslint-disable no-alert */

const AddMenu = ({}) => (
  <PlaylistMenu id="playlist-add-menu">
    <div className="add-url" />
    <div
      className="add-dir"
      onClick={() =>
        alert("Not supported in Winampify, but checkout Winamp2-js")
      }
    />
    <div
      className="add-file"
      onClick={() =>
        alert("Not supported in Winampify, but checkout Winamp2-js")
      }
    />
  </PlaylistMenu>
);

const mapStateToProps = state => ({
  nextIndex: state.playlist.trackOrder.length
});

export default connect(mapStateToProps, undefined)(AddMenu);
