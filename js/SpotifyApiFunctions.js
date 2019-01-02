import SpotifyApiService from "./SpotifyApiService";

// input: URI of an artist (string)
// output: name of artist (string)
export const getArtistName = URI => {
  return new Promise(resolve =>
    SpotifyApiService.get(`artists/${URI}`).then(res => resolve(res.name))
  );
};

// input: URI of a track
// output: artist: string, name: string, duration: number
export const getTrackInfos = URI => {
  return new Promise(resolve => {
    SpotifyApiService.get(`tracks/${URI}`).then(res =>
      resolve({
        artist: res.artists[0].name,
        name: res.name,
        duration: res.duration_ms
      })
    );
  });
};

export const getArtistInfos = id => {
  return new Promise(resolve => {
    SpotifyApiService.get(`artists/${id}`).then(res => resolve(res));
  });
};

export const getAlbumInfos = id => {
  return new Promise(resolve => {
    SpotifyApiService.get(`albums/${id}`).then(res => resolve(res));
  });
};

export const getAlbumsFromArtist = artistId => {
  return new Promise(resolve => {
    SpotifyApiService.get(
      `artists/${artistId}/albums?include_groups=album%2Csingle`
    ).then(res => {
      resolve(res.items);
    });
  });
};

export const getTracksFromAlbum = albumId => {
  return new Promise(resolve => {
    SpotifyApiService.get(`albums/${albumId}/tracks`).then(res =>
      resolve(res.items)
    );
  });
};

export const getTopArtistsFromMe = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me/top/artists").then(res => resolve(res.items));
  });
};

export const getFollowedArtistsFromMe = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me/following?type=artist").then(res =>
      resolve(res.artists.items)
    );
  });
};

export const getMyRecentlyPlayed = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me/player/recently-played").then(res =>
      resolve(res.items.map(obj => obj.track))
    );
  });
};

export const getMyLibraryAlbums = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me/albums").then(res => resolve(res.items));
  });
};

export const getMyLibraryTracks = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me/tracks").then(res => resolve(res.items));
  });
};

export const getSearchResult = (search, scope, offset) => {
  return new Promise(resolve => {
    SpotifyApiService.get(
      `search?q=${search}&type=${scope}&offset=${offset}`
    ).then(res => resolve(res));
  });
};

export const getUserInfos = () => {
  return new Promise(resolve => {
    SpotifyApiService.get("me").then(res => resolve(res));
  });
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
