import React from "react";
import { MenuProvider } from "react-contexify";
import { FaCog, FaFolder } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { GenericFile, OPEN_FOLDER_ACTION } from "../../types";
import {
  isAction,
  isAlbum,
  isArtist,
  isImage,
  isPlaylist,
  isTrack
} from "../../types/typecheckers";
import ImgCached from "../Reusables/ImgCached";
import "./file.css";
import winampSoundFile from "./images/bigWinampIcon.png";
import winampLogo from "./images/winamp-icon.png";
import githubIcon from "./images/githubIcon.png";
import InputRenaming from "./InputRenaming";

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
    if (isAction(file) && file.id === "settings") {
      return <IconSettings />;
    }
    if (isAction(file) && file.id === "winamp") {
      return <Image src={winampLogo} cachedSize={{ w: 50, h: 50 }} />;
    }
    if (isAction(file) && file.id === "github") {
      return <Image src={githubIcon} cachedSize={{ w: 50, h: 50 }} />;
    }
    if (isTrack(file))
      return <Image src={winampSoundFile} cachedSize={{ w: 50, h: 50 }} />;
    if (isPlaylist(file) || isAlbum(file) || isArtist(file) || isAction(file))
      return <IconFolder />;
    if (isImage(file))
      return <Image src={file.metaData.url} cachedSize={{ w: 50, h: 50 }} />;

    return <Image src={winampSoundFile} cachedSize={{ w: 50, h: 50 }} />;
  };

  return (
    <MenuProvider id={file.metaData.type}>
      <Container
        file={file}
        id={file.id}
        onMouseDown={props.onClick}
        onDoubleClick={props.onDoubleClick}
      >
        {getIcon()}
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

const Image = styled(ImgCached)`
  width: 50px;
  height: 50px;
  z-index: -4;
`;

const IconFolder = styled(FaFolder)`
  width: 50px;
  height: 50px;
  fill: ${props => props.theme.folder.color};
`;

const IconSettings = styled(FaCog)`
  width: 50px;
  height: 50px;
  fill: gray;
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
