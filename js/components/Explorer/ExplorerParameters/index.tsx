import React from "react";
import styled, { css } from "styled-components";
import { SingleExplorerState } from "../../../reducers/explorer";
import VerticalSeparator from "./VerticalSeparator";
interface Props {
  explorer: SingleExplorerState;
}

const ExplorerParameters = (props: Props) => {
  return (
    <Bar>
      <FlexRowContainer>
        <Parameter width={200}>Name</Parameter>
        <VerticalSeparator />
        <Parameter width={200}>Duration</Parameter>
      </FlexRowContainer>
    </Bar>
  );
};

export default ExplorerParameters;

const Bar = styled.div`
  background-color: white;
  transition: all 0.5s;
  width: auto;
  height: auto;
`;

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  overflow: hidden;
`;

const Parameter = styled.div<{ width: number }>`
  width: ${props => `${props.width}px`};
`;
