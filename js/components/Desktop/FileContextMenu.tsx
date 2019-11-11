import React from "react";
import { ContextMenu, Item, Separator } from "react-contexify";
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
      <ContextMenu id="track">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
        <Separator />
        {getTrackData()}
      </ContextMenu>

      <ContextMenu id="artist">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </ContextMenu>

      <ContextMenu id="album">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </ContextMenu>

      <ContextMenu id="image">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
      </ContextMenu>

      <ContextMenu id="desktop">{pasteItem()}</ContextMenu>
    </div>
  );
};
export default FileContextMenu;
