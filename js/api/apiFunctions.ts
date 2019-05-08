import Api from ".";

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
    `artists/${artistId}/albums?include_groups=album%2Csingle`
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
    `albums/${albumId}/tracks`
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
  const response: any = await Api.get("me/player/recently-played");
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

// TODO: Work In Progress
/* export const getPlaylist = (tracks, user, URI, offset) => {
 fetch(
    `https://api.spotify.com/v1/users/${user}/playlists/${URI}/tracks?offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.res())
    .then(json => {
      const items = json.items;
      if (items[0].track.id !== null) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].track !== null)
            tracks.push({
              artist: items[i].track.artists[0].name,
              duration: items[i].track.duration_ms / 1000,
              name: items[i].track.name,
              uri: items[i].track.id,
              index: i + offset
            });
        }
        if (tracks.length === offset + 100)
          getPlaylist(token, tracks, user, URI, offset + 100, (err, res) =>
            callback(err, res)
          );
        else callback(null, tracks);
      } else callback(tracks);
    })
    .catch(err => {
      console.log(err);
    });
    export const getTracksFromPlaylist = (token, playlist, callback) => {
  const offset = 0;
  let user;
  let URI;
  let tracks = [];
  const p = playlist.split(":");
  if (p.length === 5) {
    user = p[2];
    URI = p[4];
  }
  if (p.length === 4) {
    user = p[1];
    URI = p[3];
  }
  if (p.length === 3) {
    tracks = [];
    URI = p[2];
    getTracksFromAlbum(URI).then(res => console.log(res));
  } else {
    console.log("Work In Progress Here");
  } /* TODO: getPlaylist(token, tracks, user, URI, offset, (err, res) =>
      callback(err, res)
    ); };
*/
