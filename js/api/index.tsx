import store from "../store";
import { apiendpoint } from "./settings";

class Api {
  static authenticate(accessToken: string) {
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

  static get(endpoint: string): Promise<any> {
    const { accessToken } = store.getState().user;
    return new Promise((resolve, reject) => {
      fetch(`${apiendpoint}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(res => {
          if (res.error && res.error.message) alert(res.error.message);
          else resolve(res);
        })
        .catch(reject);
    });
  }

  static put(endpoint: string, params: any): Promise<any> {
    const { accessToken } = store.getState().user;
    return new Promise(resolve => {
      fetch(`${apiendpoint}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        ...params
      })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(res => {
          if (res.error && res.error.message) alert(res.error.message);
          else resolve(res);
        });
    });
  }
}

export default Api;
