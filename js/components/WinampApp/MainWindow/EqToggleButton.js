import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { TOGGLE_EQUALIZER_WINDOW } from "../../../actionTypes";
/* eslint-disable no-alert */

const EqToggleButton = props => (
  <div
    id="equalizer-button"
    className={classnames({ selected: props.equalizer })}
    onClick={() => alert("Not supported in Winampify, but checkout Winamp2-js")}
    title="Toggle Graphical Equalizer"
  />
);

const mapStateToProps = state => ({
  equalizer: state.windows.equalizer
});

const mapDispatchToProps = dispatch => ({
  handleClick: () => dispatch({ type: TOGGLE_EQUALIZER_WINDOW })
});

export default connect(mapStateToProps, mapDispatchToProps)(EqToggleButton);
