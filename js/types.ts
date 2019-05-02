import {
  AlbumData,
  ArtistData,
  TrackData,
  PlaylistData,
  ImageData
} from "./SpotifyApi/types";
import { ACTION_TYPE } from "./actions/explorer";

export interface File {
  id: string;
  isRenaming: boolean;
  title: string;
  x: number;
  y: number;
  locked: boolean;
  metaData:
    | TrackData
    | AlbumData
    | ArtistData
    | PlaylistData
    | ImageData
    | null;
}

export interface AlbumFile extends File {
  metaData: AlbumData;
}
export interface ArtistFile extends File {
  metaData: ArtistData;
}

export interface TrackFile extends File {
  metaData: TrackData;
}

export interface ImageFile extends File {
  metaData: ImageData;
}

export interface ActionFile extends File {
  metaData: ActionData;
}

export type GenericData = TrackData | AlbumData | PlaylistData | ArtistData;
export type GenericFile =
  | AlbumFile
  | ArtistFile
  | TrackFile
  | ImageFile
  | ActionFile;

export interface Image {
  id: string;
  source: string;
  x: number;
  y: number;
}

export interface Artist {}

export const FILE_TYPE = {
  ARTIST: "artist",
  ALBUM: "album",
  TRACK: "track",
  IMAGE: "image"
};
