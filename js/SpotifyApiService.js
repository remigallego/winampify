import React from "react";

class SpotifyApiService extends React.Component {
  constructor() {
    super();
    this.accessToken = null;
    this.apiEndpoint = "https://api.spotify.com/v1";
    this.setAccessToken = this.setAccessToken.bind(this);
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  get(endpoint) {
    return new Promise(resolve => {
      console.log("GET:", endpoint);
      fetch(`${this.apiEndpoint}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
        .then(response => response.json())
        .then(json => {
          console.log("GET Result:", json);
          resolve(json);
        })
        .catch(console.error);
    });
  }
}

const SpotifyApiServiceInstance = new SpotifyApiService();
export default SpotifyApiServiceInstance;
