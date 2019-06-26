import environments from "../environments";
import { SET_ACCESS_TOKEN } from "../reducers/auth";
import store from "../store";
import { apiendpoint } from "./settings";

class Api {
  public static authenticate(accessToken: string) {
    return new Promise((resolve, reject) => {
      fetch(`${apiendpoint}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(res => {
          if (res.error && res.error.message) {
            if (res.error.message === "Invalid access token") {
              return this.refreshToken().then(response => {
                store.dispatch({
                  type: SET_ACCESS_TOKEN,
                  payload: {
                    accessToken: response.access_token
                  }
                });
                resolve(this.authenticate(response.access_token));
              });
            }
          }
          resolve({ ...res, accessToken });
        })
        .catch(reject);
    });
  }

  public static refreshToken(): Promise<any> {
    const { refreshToken } = store.getState().auth;
    const endpoint =
      process.env.NODE_ENV === "production"
        ? environments.prod.authServer
        : environments.dev.authServer;
    return new Promise((resolve, reject) => {
      fetch(`${endpoint}/refresh_token?refresh_token=${refreshToken}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(reject);
    });
  }

  public static get(endpoint: string): Promise<any> {
    const { accessToken } = store.getState().auth;
    return new Promise((resolve, reject) => {
      fetch(`${apiendpoint}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(res => {
          if (res.error && res.error.message) {
            if (res.error.message === "Invalid access token") {
              return this.refreshToken().then(response => {
                store.dispatch({
                  type: SET_ACCESS_TOKEN,
                  payload: {
                    accessToken: response.access_token
                  }
                });
                resolve(this.get(endpoint));
              });
            }
          } else {
            resolve(res);
          }
        });
    });
  }

  public static put(endpoint: string, params: any): Promise<any> {
    const { accessToken } = store.getState().auth;
    return new Promise(resolve => {
      fetch(`${apiendpoint}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        ...params
      }).then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            return this.refreshToken().then(res => {
              store.dispatch({
                type: SET_ACCESS_TOKEN,
                payload: {
                  accessToken: res.access_token
                }
              });
              resolve(this.put(endpoint, params));
            });
          }
        } else Promise.resolve();
      });
    });
  }
}

export default Api;
