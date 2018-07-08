import { ContextMenu, Item, Separator, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
import React from "react";

const FileContextMenu = ({
  onRename,
  onDelete,
  addToPlaylist,
  onCopy,
  onPaste
}) => {
  const renameItem = () => <Item onClick={onRename}>Rename</Item>;
  const deleteItem = () => <Item onClick={onDelete}>Delete</Item>;
  const addToPlaylistItem = () => (
    <Item onClick={addToPlaylist}>Add To Playlist</Item>
  );
  const copyItem = () => <Item onClick={onCopy}>Copy</Item>;
  const pasteItem = () => <Item onClick={onPaste}>Paste</Item>;

  return (
    <div>
      <ContextMenu id="track">
        {renameItem()}
        {deleteItem()}
        {copyItem()}
        <Separator />
        {addToPlaylistItem()}
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
