export interface Items {
  href: string;
  items: any[];
  limit: number;
  next: any; // ?
  offset: number;
  previous: any; // ?
  total: number;
}

export interface TrackItems extends Items {
  items: TrackData[];
}

export interface AlbumItems extends Items {
  items: AlbumData[];
}

export interface ArtistItems extends Items {
  items: ArtistData[];
}

export interface TrackData {
  artists: ArtistData[];
  available_markets: string[];
  disc_number: number;
  explicit: boolean;
  external_urls: {
    [service: string]: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  track_number: number;
  type: "track";
  uri: string;
}

export interface ArtistData {
  external_urls: {
    [service: string]: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: ImageData[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export interface AlbumData {
  album_type: string;
  artists: ArtistData[];
  available_markets: string[];
  copyrights: CopyrightData[];
  external_ids: {
    [service: string]: string;
  };
  external_urls: {
    [service: string]: string;
  };
  genres: any[];
  href: string;
  id: string;
  images: ImageData[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: Items;
  type: "album";
  uri: string;
}

export interface PlaylistData {
  type: "playlist";
  // TODO: To be defined
}

export interface ImageData {
  height: number;
  width: number;
  url: string;
}

export interface Search {
  albums: Items;
  artists: Items;
  playlists: Items;
  tracks: Items;
}

export interface CopyrightData {
  text: string;
  type: string;
}
