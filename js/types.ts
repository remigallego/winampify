import {
  AlbumData,
  ArtistData,
  TrackData,
  PlaylistData
} from "./SpotifyApi/types";

export interface File {
  id: string;
  isRenaming: boolean;
  title: string;
  x: number;
  y: number;
  metaData: TrackData | AlbumData | ArtistData | PlaylistData | null;
}

export interface AlbumFile extends File {
  metaData: AlbumData;
}
export interface ArtistFile extends File {
  metaData: ArtistData;
}

export type GenericData = TrackData | AlbumData | PlaylistData | ArtistData;

export interface Image {
  id: string;
  source: string;
  x: number;
  y: number;
}

export interface Artist {}
