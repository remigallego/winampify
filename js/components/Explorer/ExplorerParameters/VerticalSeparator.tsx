import React from "react";
import styled, { css } from "styled-components";

const VerticalSeparator = () => {
  return (
    <Container>
      <Bar />
    </Container>
  );
};

const Bar = styled.div`
  background-color: black;
  height: 20px;
  width: 1px;
`;

const Container = styled.div`
  cursor: col-resize;
  padding-right: 5px;
  padding-left: 5px;
`;
export default VerticalSeparator;
