import Api from ".";
import store from "../store";

const getCountry = () => store.getState().user.country;

/**
 * Get an Artist
 *
 * GET /v1/artists/{id}
 * https://developer.spotify.com/web-api/get-artist/
 */
export const getArtistData = async (URI: string) => {
  const response: SpotifyApi.SingleArtistResponse = await Api.get(
    `artists/${URI}`
  );
  return response;
};

/**
 * Get a track
 *
 * GET /v1/tracks/{id}
 * https://developer.spotify.com/web-api/get-track/
 */
export const getTrackData = async (URI: string) => {
  const response: SpotifyApi.SingleTrackResponse = await Api.get(
    `tracks/${URI}`
  );
  return response;
};

/**
 * Get an Album
 *
 * GET /v1/albums/{id}
 * https://developer.spotify.com/web-api/get-album/
 */
export const getAlbumData = async (id: string) => {
  const response: SpotifyApi.SingleAlbumResponse = await Api.get(
    `albums/${id}`
  );
  return response;
};

/**
 * Get an Artist’s Albums
 *
 * GET /v1/artists/{id}/albums
 * https://developer.spotify.com/web-api/get-artists-albums/
 */
export const getAlbumsFromArtist = async (artistId: string) =>
  getItemsRecursively(
    `artists/${artistId}/albums?include_groups=album&market=${getCountry()}`
  );

/**
 * Get an Album’s Tracks
 *
 * GET /v1/albums/{id}/tracks
 * https://developer.spotify.com/web-api/get-albums-tracks/
 */
export const getTracksFromAlbum = async (albumId: string) =>
  getItemsRecursively(`albums/${albumId}/tracks?market=${getCountry()}`);

/**
 * Get a User’s Top Artists and Tracks (Note: This is only Artists)
 *
 * GET /v1/me/top/{type}
 * https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/
 */
export const getTopArtistsFromMe = async () => {
  const response: SpotifyApi.UsersTopArtistsResponse = await Api.get(
    "me/top/artists"
  );
  return response.items;
};

/**
 * Get User’s Followed Artists
 *
 * GET /v1/me/following
 * https://developer.spotify.com/web-api/get-followed-artists/
 */
export const getFollowedArtistsFromMe = async () => {
  const response: SpotifyApi.UsersFollowedArtistsResponse = await Api.get(
    "me/following?type=artist"
  );
  const items = response.artists.items;
  return items;
};

export const getMyRecentlyPlayed = async () =>
  getItemsRecursively("me/player/recently-played");

/**
 * Get user's saved albums
 *
 * GET /v1/me/albums
 * https://developer.spotify.com/web-api/get-users-saved-albums/
 */
export const getMyLibraryAlbums = async () => getItemsRecursively("me/albums");

/**
 * Get user's saved tracks
 *
 * GET /v1/me/tracks
 * https://developer.spotify.com/web-api/get-users-saved-tracks/
 */
export const getMyLibraryTracks = async () => getItemsRecursively("me/tracks");

/**
 * Get Current User’s Profile
 *
 * GET /v1/me
 * https://developer.spotify.com/web-api/get-current-users-profile/
 */
export const getUserInfos = async () => {
  const response: SpotifyApi.CurrentUsersProfileResponse = await Api.get("me");
  return response;
};

type SearchResponse =
  | SpotifyApi.AlbumSearchResponse
  | SpotifyApi.TrackSearchResponse
  | SpotifyApi.ArtistSearchResponse;

interface GenericSearchResponse {
  [key: string]: SpotifyApi.PagingObject<SearchResponse>;
}

export const searchFor: (
  query: string,
  types: string[],
  offset: number
) => Promise<GenericSearchResponse[]> = async (query, types, offset) => {
  const searchQueries = types.map(queryType => {
    return Api.get(`search?type=${queryType}&q=${query}&offset=${offset}`);
  });

  const response = await Promise.all(searchQueries);
  return response;
};

export const getItemsRecursively = async (
  endpoint: string,
  limit = 20,
  offset = 0
): Promise<any[]> => {
  if (endpoint.includes("?")) endpoint = `${endpoint}&offset=${offset}`;
  else endpoint = `${endpoint}?offset=${offset}`;
  const response = await Api.get(endpoint);
  if (offset + limit < response.total) {
    return [
      ...response.items,
      ...(await getItemsRecursively(endpoint, offset + limit, limit))
    ];
  }
  return response.items;
};
