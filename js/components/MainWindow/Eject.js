import React from "react";
import { connect } from "react-redux";

import { openMediaFileDialog } from "../../actionCreators";

const Eject = props => (
  <div id="eject" onClick={() => alert("Not supported in Winampify, but checkout Winamp2-js")} title="Open File(s)" />
);

const mapDispatchToProps = { openMediaFileDialog };

export default connect(null, mapDispatchToProps)(Eject);
