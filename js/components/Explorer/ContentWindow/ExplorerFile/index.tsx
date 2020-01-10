import React, { ReactNode } from "react";
import { FaFolder } from "react-icons/fa";
import styled, { css } from "styled-components";
import { GenericFile } from "../../../../types";
import {
  isAlbum,
  isArtist,
  isImage,
  isPlaylist,
  isTrack
} from "../../../../types/typecheckers";
import ImgCached from "../../../Reusables/ImgCached";
import folderclosed from "../../images/folder-closed.ico";
import winampmp3 from "../../images/winamp-mp3.png";

interface Props {
  file: GenericFile;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode;
  onDrag(e: React.DragEvent<HTMLDivElement>): void;
}

export default function(props: Props) {
  if (!props.file) return null;
  const { selected, onClick, onDoubleClick, children } = props;
  const { file } = props;
  const icons = [];

  if (isPlaylist(file) || isAlbum(file) || isArtist(file)) {
    icons.push(
      folderclosed,
      file.metaData.images.length > 0 ? file.metaData.images[0].url : ""
    );
  } else if (isTrack(file)) {
    icons.push(winampmp3);
  } else if (isImage(file)) {
    icons.push(file.metaData.url);
  }

  const renderIcons = (iconsArr: string[]) => {
    if (iconsArr.length > 1) {
      return (
        <IconContainer>
          <IconFolder size={14} />
          <IconSmall src={iconsArr[1]} cachedSize={{ h: 20, w: 20 }} />
        </IconContainer>
      );
    }
    if (isImage(props.file)) {
      return (
        <IconContainer>
          <IconBig src={iconsArr[0]} cachedSize={{ h: 20, w: 20 }} />
        </IconContainer>
      );
    }
    return (
      <IconContainer>
        <IconBig src={iconsArr[0]} />
      </IconContainer>
    );
  };

  return (
    <FileContainer
      selected={selected}
      onMouseDown={onClick}
      onDoubleClick={onDoubleClick}
      draggable={true}
      onDragStart={e => props.onDrag(e)}
      id={`file-${props.file.id}`}
    >
      {renderIcons(icons)}
      <FileName>{children}</FileName>
    </FileContainer>
  );
}
const FileContainer = styled.div<{ selected: boolean }>`
  font-family: "Open Sans";
  cursor: default;
  user-select: none;
  box-sizing: border-box;
  height: 23px;
  display: flex;
  width: 100%;
  background-color: transparent;
  border: 1px solid transparent;
  color: ${props => props.theme.explorer.file.text};
  ${props =>
    props.selected &&
    css`
      background-color: #3064bd;
      color: white;
      border: 1px solid white;
      border-style: dotted;
    `};
`;
const FileName = styled.div`
  user-select: none;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const IconContainer = styled.div`
  position: relative;
  margin-right: 5px;
  margin-left: 2px;
  left: 0;
  top: 0;
  width: 14px;
  height: 14px;
`;

const IconBig = styled(ImgCached)`
  position: relative;
  width: 14px;
  height: 14px;
`;
const IconSmall = styled(ImgCached)`
  position: absolute;
  width: 8px;
  height: 8px;
  left: 6px;
  top: 6px;
`;

const IconFolder = styled(FaFolder)`
  width: 14px;
  height: 14px;
  fill: ${props => props.theme.folder.color};
`;
