import { getUserInfos } from "../SpotifyApiFunctions";

export function setUserInfos() {
  return dispatch => {
    getUserInfos().then(res => {
      dispatch({
        type: "SET_USER_INFOS",
        name: res.display_name,
        image: res.images[0].url,
        uri: res.uri
      });
    });
  };
}
