import { ACTION_TYPE } from "./actions/explorer";

export interface ImageModalType {
  id: string;
  source: string;
  x: number;
  y: number;
}


export interface ImageData {
  name: string;
  url: string;
  type: "image";
}

export interface ActionData {
  action: ACTION_TYPE;
  type: "action";
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
export type GenericFile = File<
  | SpotifyApi.TrackObjectFull
  | SpotifyApi.AlbumObjectFull
  | SpotifyApi.ArtistObjectFull
  | ActionData
  | ImageData
>;

export type TrackFile = File<SpotifyApi.TrackObjectFull>;
export type AlbumFile = File<SpotifyApi.AlbumObjectFull>;
export type ArtistFile = File<SpotifyApi.ArtistObjectFull>;
export type ImageFile = File<ImageData>;
export type ActionFile = File<ActionData>;
