import {
  ActionFile,
  AlbumFile,
  ArtistFile,
  GenericFile,
  ImageFile,
  PlaylistFile,
  SkinFile,
  TrackFile
} from ".";

// user defined type guards
export const isTrack = (file: GenericFile): file is TrackFile => {
  return file.metaData.type === "track";
};
export const isAlbum = (file: GenericFile): file is AlbumFile => {
  return file.metaData.type === "album";
};
export const isArtist = (file: GenericFile): file is ArtistFile => {
  return file.metaData.type === "artist";
};
export const isImage = (file: GenericFile): file is ImageFile => {
  return file.metaData.type === "image";
};
export const isPlaylist = (file: GenericFile): file is PlaylistFile => {
  return file.metaData.type === "playlist";
};
export const isAction = (file: GenericFile): file is ActionFile => {
  return file.metaData.type === "action";
};
export const isSkin = (file: GenericFile): file is SkinFile => {
  return file.metaData.type === "skin";
};
