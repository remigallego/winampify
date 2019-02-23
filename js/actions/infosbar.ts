import { getUserInfos } from "../SpotifyApiFunctions";
import { Dispatch, Action } from "redux";

export function setUserInfos() {
  return (dispatch: Dispatch<Action>) => {
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
