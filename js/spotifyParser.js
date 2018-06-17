export const getArtistName = (token, URI, callback) => {
  fetch(`https://api.spotify.com/v1/artists/${URI}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      callback(json.name);
    });
};

export const parseTrackURI = (token, URI, callback) => {
  fetch(`https://api.spotify.com/v1/tracks/${URI}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      callback({
        artist: json.artists[0].name,
        name: json.name,
        duration: json.duration_ms
      });
    });
};

export const parseAlbumsFromArtist = (token, artistId, callback) => {
  let albums = [];
  fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album%2Csingle`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.json())
    .then(json => {
      albums = json.items;
      callback(null, albums);
    });
};

export const parseTracksFromAlbum = (token, albumId, callback) => {
  let tracks = [];
  fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      tracks = json.items;
      callback(null, tracks);
    })
    .catch(err => callback(err));
};

export const parseTopArtistsFromMe = (token, callback) => {
  let artists = [];
  fetch(`https://api.spotify.com/v1/me/top/artists`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      artists = json.items;
      callback(null, artists);
    })
    .catch(err => callback(err));
};

export const parseFollowedArtistsFromMe = (token, callback) => {
  let artists = [];
  fetch(`https://api.spotify.com/v1/me/following?type=artist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      artists = json.artists.items;
      callback(null, artists);
    })
    .catch(err => callback(err));
};

export const parseMyRecentlyPlayed = (token, callback) => {
  let tracks = [];
  fetch(`https://api.spotify.com/v1/me/player/recently-played`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      tracks = json.items;
      callback(null, tracks.map(obj => obj.track));
    })
    .catch(err => callback(err));
};

export const parseMyLibraryAlbums = (token, callback) => {
  let albums = [];
  fetch(`https://api.spotify.com/v1/me/albums`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      albums = json.items;
      callback(null, albums);
    })
    .catch(err => callback(err));
};

export const parseMyLibraryTracks = (token, callback) => {
  let tracks = [];
  fetch(`https://api.spotify.com/v1/me/tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      tracks = json.items;
      callback(null, tracks);
    })
    .catch(err => callback(err));
};

export const parseSearchSpotify = (token, search, scope, offset, callback) => {
  fetch(
    `https://api.spotify.com/v1/search?q=${search}&type=${scope}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.json())
    .then(res => {
      callback(null, res);
    })
    .catch(err => callback(err));
};

export const parseArtist = (token, id, callback) => {
  let results = [];
  fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      results = json;
      callback(null, results);
    })
    .catch(err => callback(err));
};

export const fetchplaylist = (token, tracks, user, URI, offset, callback) => {
  fetch(
    `https://api.spotify.com/v1/users/${user}/playlists/${URI}/tracks?offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.json())
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
          fetchplaylist(token, tracks, user, URI, offset + 100, (err, res) =>
            callback(err, res)
          );
        else callback(null, tracks);
      } else callback(tracks);
    })
    .catch(err => {
      console.log(err);
    });
};

export const fetchAlbum = (token, tracks, album, callback) => {
  fetch(`https://api.spotify.com/v1/albums/${album}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      const albumTracks = json.tracks.items;
      if (albumTracks[0].id !== null) {
        for (let i = 0; i < albumTracks.length; i++) {
          if (albumTracks[i].artists !== undefined)
            tracks.push({
              artist: albumTracks[i].artists[0].name,
              duration: albumTracks[i].duration_ms / 1000,
              name: albumTracks[i].name,
              uri: albumTracks[i].id,
              index: i
            });
        }
        callback(null, tracks);
      }
    })
    .catch(err => {
      callback(err);
    });
};

export const parseTracksPlaylist = (token, playlist, callback) => {
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
    fetchAlbum(token, tracks, URI, (err, res) => callback(err, res));
  } else
    fetchplaylist(token, tracks, user, URI, offset, (err, res) =>
      callback(err, res)
    );
};

export const parseTracksAlbum = (token, album, callback) => {
  let offset = 0;
  let user;
  let URI;
  let tracks = [];
  fetchAlbum(token, tracks, album, (err, res) => callback(err, res));
};

export const getAlbumInfos = (token, id, callback) => {
  let cover = "";
  fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(json => {
      callback(null, json);
    })
    .catch(err => callback(err));
};
