import { Action } from "redux";

export interface UserState {
  name: string;
  image: string;
  uri: string;
  logged: boolean;
  accessToken: string;
  refreshToken: string;
}

const initialState: UserState = {
  name: "",
  image: "",
  uri: "",
  logged: false,
  accessToken: "",
  refreshToken: ""
};

export const SET_USER_INFOS = "SET_USER_INFOS";
export const SET_TOKENS = "SET_TOKENS";

const user = (state: UserState = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_INFOS:
      return {
        ...state,
        name: action.payload.name,
        image: action.payload.image,
        uri: action.payload.uri,
        logged: true
      };
    case SET_TOKENS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    default:
      return state;
  }
};

export default user;
