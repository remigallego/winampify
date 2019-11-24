import React from "react";
import { Menu, Item, Separator } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";

interface Props {
  onRename: (e: any) => void;
  onDelete: (e: any) => void;
  onCopy: (e: any) => void;
  onPaste: (e: any) => void;
  onTrackData: (e: any) => void;
}

const FileContextMenu = (props: Props) => {
  const renameItem = () => <Item onClick={props.onRename}>Rename</Item>;
  const deleteItem = () => <Item onClick={props.onDelete}>Delete</Item>;
  const copyItem = () => <Item onClick={props.onCopy}>Copy</Item>;
  const pasteItem = () => <Item onClick={props.onPaste}>Paste</Item>;
  const getTrackData = () => (
    <Item onClick={props.onTrackData}>Track Data</Item>
  );

  return (
    <div>
      <Menu id="track">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
        <Separator />
        {getTrackData()}
      </Menu>

      <Menu id="artist">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </Menu>

      <Menu id="album">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </Menu>

      <Menu id="image">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </Menu>

      <Menu id="desktop">{pasteItem()}</Menu>
    </div>
  );
};
export default FileContextMenu;
