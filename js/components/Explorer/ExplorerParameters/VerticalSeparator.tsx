import React from "react";
import styled, { css } from "styled-components";
import Rnd from "react-rnd";

const VerticalSeparator = () => {
  return <div />;
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 2,
        height: "100%"
      }}
      /*     enableResizing={{
        left: false,
        right: false
      }} */
      style={{
        backgroundColor: "black",
        cursor: "col-resize"
      }}
    ></Rnd>
  );
};

const Bar = styled.div``;

export default VerticalSeparator;
