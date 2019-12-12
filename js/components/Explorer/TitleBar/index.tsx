import React from "react";
import { blueTitleBar } from "../../../styles/colors";
import CloseIcon from "../Icons/CloseIcon";
import { dragHandleClassName } from "../vars";
import styled from "styled-components";

interface Props {
  onClose?: () => void | null;
  title: string;
}

const TitleBar = (props: Props) => {
  return (
    <Bar className={dragHandleClassName}>
      <FlexRowContainer>
        <Title>{props.title}</Title>
        {props.onClose && <CloseIcon onClick={props.onClose} />}
      </FlexRowContainer>
    </Bar>
  );
};

export default TitleBar;

const Bar = styled.div`
  background-color: ${blueTitleBar};
  background: 'linear-gradient("#026bfe", "#1a6cd0")';
  width: auto;
  height: auto;
  cursor: move;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
`;

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  overflow: hidden;
`;

const Title = styled.div`
  padding: 3px;
  padding-left: 10px;
  font-family: "Open Sans";
  font-size: 16px;
  color: white;
  font-weight: 500;
  white-space: no-wrap;
  user-select: none;
  overflow: hidden;
  text-overflow: hidden;
`;
