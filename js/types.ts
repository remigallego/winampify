import {
  AlbumData,
  ArtistData,
  TrackData,
  PlaylistData,
  ImageData,
  ActionData
} from "./api/types";
export interface ImageModalType {
  id: string;
  source: string;
  x: number;
  y: number;
}

export interface File<T> {
  id: string;
  isRenaming: boolean;
  title: string;
  x: number;
  y: number;
  locked: boolean;
  metaData: T;
}

/*
 A file can either be:
- A track
- An album
- An artist
- An image
- An action (open Top Artists, open Webamp, ...)
TODO: - A playlist
TODO: - A custom folder
*/
export type GenericFile = File<TrackData | ActionData | AlbumData | ArtistData | ImageData>;
export type TrackFile = File<TrackData>;
export type AlbumFile = File<AlbumData>;
export type ArtistFile = File<ArtistData>;
export type ImageFile = File<ImageData>;
export type ActionFile = File<ActionData>;