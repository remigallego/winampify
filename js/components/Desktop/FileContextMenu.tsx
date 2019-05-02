import { ContextMenu, Item, Separator } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import React from "react";

interface Props {
  onRename: (e: any) => void;
  onDelete: (e: any) => void;
  addToPlaylist: (e: any) => void;
  onCopy: (e: any) => void;
  onPaste: (e: any) => void;
  onTrackData: (e: any) => void;
}

const FileContextMenu = (props: Props) => {
  const renameItem = () => <Item onClick={props.onRename}>Rename</Item>;
  const deleteItem = () => <Item onClick={props.onDelete}>Delete</Item>;
  const addToPlaylistItem = () => (
    <Item onClick={props.addToPlaylist}>Add To Playlist</Item>
  );
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
        {addToPlaylistItem()}
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
