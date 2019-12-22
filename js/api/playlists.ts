import Api from ".";
import { TrackFile, SimplifiedTrack } from "../types";

/**
 * Get a playlist
 *
 * GET /v1/me/playlists
 * https://developer.spotify.com/web-api/get-users-saved-tracks/
 */
export const getPlaylist = async (playlistId: string) => {
  const response: SpotifyApi.SinglePlaylistResponse = await Api.get(
    `playlists/${playlistId}`
  );
  return response;
};

/**
 * Get user's saved playlists
 *
 * GET /v1/me/playlists
 * https://developer.spotify.com/web-api/get-users-saved-tracks/
 */
export const getMyPlaylists = async () => {
  const response: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await Api.get(
    "me/playlists"
  );
  return response.items;
};

/**
 * Get tracks from a playlist
 *
 * GET /v1/playlists/${playlistId}/tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const getTracksFromPlaylist = async (playlistId: string) => {
  const response: SpotifyApi.PlaylistTrackResponse = await Api.get(
    `playlists/${playlistId}/tracks`
  );
  return response.items;
};

/**
 * Add tracks to a playlist
 *
 * POST /v1/playlists/${playlistId}/tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
export const addTracksToPlaylist = async (
  playlistId: string,
  tracks: SimplifiedTrack[]
) => {
  const uris = tracks.map(track => {
    return `spotify:track:${track.url}`;
  });
  const response: SpotifyApi.AddTracksToPlaylistResponse = await Api.post(
    `playlists/${playlistId}/tracks`,
    {
      body: JSON.stringify({
        uris
      })
    }
  );
  return response;
};
