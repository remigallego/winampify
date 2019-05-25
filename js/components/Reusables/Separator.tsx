import React, { CSSProperties } from "react";

const Separator = ({
  color,
  style
}: {
  color: string;
  style: CSSProperties;
}) => (
  <div style={style}>
    <div style={{ backgroundColor: color, height: 1, width: "100%" }} />
  </div>
);
export default Separator;
