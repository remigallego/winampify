import {
  GenericFile,
  TrackFile,
  AlbumFile,
  ArtistFile,
  ImageFile,
  ActionFile
} from "./types";

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
export const isAction = (file: GenericFile): file is ActionFile => {
  return file.metaData.type === "action";
};
