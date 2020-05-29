import React from "react";
import styled, { css } from "styled-components";
import { blueTitleBar } from "../../../styles/colors";
import CloseIcon from "../Icons/CloseIcon";
import { dragHandleClassName } from "../vars";
import MinimizeIcon from "../Icons/MinimizeIcon";

interface Props {
  onClose?: () => void | null;
  onMinimize?: () => void | null;
  title?: string;
  playlist?: boolean;
}

const TitleBar = (props: Props) => {
  return (
    <Bar className={dragHandleClassName} playlist={props.playlist}>
      <FlexRowContainer>
        <Title playlist={props.playlist}>
          {props.title || ""} {props.playlist && "[Playlist]"}
        </Title>

        <div style={{ display: "flex", height: "100%" }}>
          {props.onMinimize && <MinimizeIcon onClick={props.onMinimize} />}
          {props.onClose && <CloseIcon onClick={props.onClose} />}
        </div>
      </FlexRowContainer>
    </Bar>
  );
};

export default TitleBar;

const Bar = styled.div<{ playlist: boolean }>`
  background-color: ${props => props.theme.explorer.title.bg};
  transition: background-color 0.3s;
  ${props =>
    props.playlist &&
    css`
      background-color: rgb(13, 256, 187);
    `}
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
  align-items: center;
  overflow: hidden;
  height: 26px;
`;

const Title = styled.div<{ playlist: boolean }>`
  transition: color 1s;
  color: ${props => (props.playlist ? "black" : "white")};
  padding-left: 10px;
  font-family: "Open Sans";
  font-size: 16px;
  font-weight: 500;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
