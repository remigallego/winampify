import {
  AlbumData,
  ArtistData,
  TrackData,
  PlaylistData,
  ImageData,
  ActionData
} from "./api/types";

export interface File<T> {
  id: string;
  isRenaming: boolean;
  title: string;
  x: number;
  y: number;
  locked: boolean;
  metaData: T;
}

export type GenericFile = File<TrackData | AlbumData | ArtistData>;
export type TrackFile = File<TrackData>;
export type AlbumFile = File<AlbumData>;
export type ArtistFile = File<ArtistData>;
export type ImageFile = File<ImageData>;
export type ActionFile = File<ActionData>;

export interface ImageModalType {
  id: string;
  source: string;
  x: number;
  y: number;
}

export interface Artist {}

export interface FILE_TYPE {
  ARTIST: "artist";
  ALBUM: "album";
  TRACK: "track";
  IMAGE: "image";
  ACTION: "action";
}

export const FILE_TYPE = {
  ARTIST: "artist",
  ALBUM: "album",
  TRACK: "track",
  IMAGE: "image",
  ACTION: "action"
};
