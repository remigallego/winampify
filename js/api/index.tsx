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
            alert(res.error.message);
          } else {
            resolve(res);
          }
        })
        .catch(reject);
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
          if (response.statusText) {
            alert(response.statusText);
          }
        } else Promise.resolve();
      });
    });
  }
}

export default Api;
