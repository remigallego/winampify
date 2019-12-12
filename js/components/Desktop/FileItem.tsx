import React from "react";
import { MenuProvider } from "react-contexify";
import { GenericFile } from "../../types";
import "./file.css";
import bigWinampIcon from "./images/bigWinampIcon.png";
import folderclosed from "./images/folderclosed.png";
import InputRenaming from "./InputRenaming";
import styled, { keyframes } from "styled-components";

interface Props {
  file: GenericFile;
  onClick?: (e: any) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  confirmRenameFile: (e: any) => void;
  selected: boolean;
}

const FileItem = (props: Props) => {
  const { file } = props;

  const getIcon = () => {
    switch (file.metaData.type) {
      case "track":
        return bigWinampIcon;
      case "album":
      case "action":
      case "artist":
        return folderclosed;
      case "image":
        return file.metaData.url;
      default:
        return bigWinampIcon;
    }
  };

  return (
    <MenuProvider id={file.metaData.type}>
      <Container
        file={file}
        id={file.id}
        onMouseDown={props.onClick}
        onDoubleClick={props.onDoubleClick}
      >
        <Image src={getIcon()} />
        {file.isRenaming ? (
          <InputRenaming
            initialValue={file.title}
            confirmRenameFile={props.confirmRenameFile}
          />
        ) : (
          <Title selected={props.selected}>{file.title}</Title>
        )}
      </Container>
    </MenuProvider>
  );
};

export default FileItem;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div<{ file: GenericFile }>`
  width: 100px;
  position: absolute;
  left: ${props => props.file.x}px;
  top: ${props => props.file.y}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation-duration: 0.18s;
  animation-name: ${fadeIn};
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  z-index: -4;
`;

const Title = styled.div<{ selected: boolean }>`
  font-size: 14px;
  text-align: center;
  color: white;
  text-shadow: 1px 1px black;
  background-color: ${props => (props.selected ? "#3064BD" : "transparent")};
  border: ${props =>
    props.selected ? "1px dotted white" : "1px dotted transparent"};
  border-style: dotted;
  box-sizing: border-box;
`;
