export interface File {
  id: string;
  title: string;
  type: string;
  uri: string;
  x: number;
  y: number;
  isRenaming: boolean;
}

export interface Image {
  id: string;
  source: string;
  x: number;
  y: number;
}

export interface Track {
  artists: Artist[];
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
  type: string;
  uri: string;
}

export interface Artist {}
