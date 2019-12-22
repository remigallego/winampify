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
export const getAlbumsFromArtist = async (artistId: string) => {
  const response: SpotifyApi.ArtistsAlbumsResponse = await Api.get(
    `artists/${artistId}/albums?include_groups=album&market=${getCountry()}`
  );
  return response.items;
};

/**
 * Get an Album’s Tracks
 *
 * GET /v1/albums/{id}/tracks
 * https://developer.spotify.com/web-api/get-albums-tracks/
 */
export const getTracksFromAlbum = async (albumId: string) => {
  const response: SpotifyApi.AlbumTracksResponse = await Api.get(
    `albums/${albumId}/tracks?market=${getCountry()}`
  );
  return response.items;
};

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

export const getMyRecentlyPlayed = async () => {
  const response: SpotifyApi.PagingObject<SpotifyApi.SavedTrackObject> = await Api.get(
    // TODO: verify is type is correct
    "me/player/recently-played"
  );
  return response.items;
};

/**
 * Get user's saved albums
 *
 * GET /v1/me/albums
 * https://developer.spotify.com/web-api/get-users-saved-albums/
 */
export const getMyLibraryAlbums = async () => {
  const response: SpotifyApi.UsersSavedAlbumsResponse = await Api.get(
    "me/albums"
  );
  return response.items;
};

/**
 * Get user's saved tracks
 *
 * GET /v1/me/tracks
 * https://developer.spotify.com/web-api/get-users-saved-tracks/
 */
export const getMyLibraryTracks = async () => {
  const response: SpotifyApi.UsersSavedTracksResponse = await Api.get(
    "me/tracks"
  );
  return response.items;
};

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
