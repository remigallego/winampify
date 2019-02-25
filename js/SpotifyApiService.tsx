import React from "react";

class SpotifyApiService {
  accessToken: string | null;
  apiEndpoint: string;

  constructor() {
    this.accessToken = null;
    this.apiEndpoint = "https://api.spotify.com/v1";
    this.setAccessToken = this.setAccessToken.bind(this);
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  get(endpoint: string) {
    return new Promise(resolve => {
      fetch(`${this.apiEndpoint}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(console.error);
    });
  }
}

const SpotifyApiServiceInstance = new SpotifyApiService();
export default SpotifyApiServiceInstance;
