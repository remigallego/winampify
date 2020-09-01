// what kind of folder was clicked on
export enum OPEN_FOLDER_ACTION {
  ALBUM,
  ARTIST,
  PLAYLIST,
  TOP,
  FOLLOWING,
  RECENTLY_PLAYED,
  LIBRARY_ALBUMS,
  LIBRARY_TRACKS,
  USER_PLAYLISTS,
  SETTINGS,
  OPEN_WEBAMP,
  OPEN_SKINS,
  LINK
}
export interface ImageDialogType {
  id: string;
  source: string;
  x: number;
  y: number;
  title: string;
  isDragging: boolean;
}

export interface ImageData {
  name: string;
  url: string;
  type: "image";
}

export interface ActionData {
  action: OPEN_FOLDER_ACTION;
  type: "action";
}

export interface SkinData {
  name: string;
  url: string;
  type: "skin";
}

export interface File<T> {
  id: string;
  isRenaming: boolean;
  title: string;
  x: number;
  y: number;
  locked: boolean;
  metaData: T;
  // Used with dataTransfer when moving a file
  deltaX?: number;
  deltaY?: number;
}

/*
 * A file is represented either in the view Explorer or in the view Desktop.
 * A file can either be:
 * - A track
 * - An album
 * - An artist
 * - An image
 * - An action (open Top Artists, open Webamp, ...)
 * TODO: - A playlist
 * TODO: - A custom folder
 */
export type GenericFile = File<
  | SpotifyApi.TrackObjectFull
  | SpotifyApi.AlbumObjectFull
  | SpotifyApi.ArtistObjectFull
  | SpotifyApi.PlaylistObjectFull
  | ActionData
  | ImageData
  | SkinData
>;

export type TrackFile = File<SpotifyApi.TrackObjectFull>;
export type AlbumFile = File<SpotifyApi.AlbumObjectFull>;
export type ArtistFile = File<SpotifyApi.ArtistObjectFull>;
export type PlaylistFile = File<SpotifyApi.PlaylistObjectFull>;
export type ImageFile = File<ImageData>;
export type ActionFile = File<ActionData>;
export type SkinFile = File<SkinData>;

// Files need to be formatted a certain way before being recognized by Webamp
export interface SimplifiedTrack {
  duration: number;
  metaData: {
    artist: string;
    title: string;
  };
  url: string;
}

export interface StyleCollection {
  [val: string]: React.CSSProperties | undefined;
}

export type SEARCH_CATEGORY = "album" | "artist" | "track";
