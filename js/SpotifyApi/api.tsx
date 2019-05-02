class SpotifyApiService {
  accessToken: string | null;
  refreshToken: string | null;
  apiEndpoint: string;

  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.apiEndpoint = "https://api.spotify.com/v1";

    this.setAccessToken = this.setAccessToken.bind(this);
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getOauthToken() {
    return (cb: (token: string | null) => void) => {
      cb(this.accessToken);
    };
  }

  get(endpoint: string): Promise<any> {
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

  put(endpoint: string, params: any): Promise<any> {
    return new Promise(() => {
      fetch(`${this.apiEndpoint}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        ...params
      }).catch(console.error);
    });
  }
}

const SpotifyApiServiceInstance = new SpotifyApiService();
export default SpotifyApiServiceInstance;
