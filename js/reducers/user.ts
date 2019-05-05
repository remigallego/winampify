import { Action } from "redux";

export interface UserState {
  name: string;
  image: string;
  uri: string;
  logged: boolean;
  loading: boolean;
  accessToken: string;
  refreshToken: string;
}

const initialState: UserState = {
  name: "",
  image: "",
  uri: "",
  logged: false,
  loading: false,
  accessToken: "",
  refreshToken: ""
};

export const SET_USER_INFOS = "SET_USER_INFOS";
export const SET_TOKENS = "SET_TOKENS";
export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const WIPE_TOKENS = "WIPE_TOKENS";
export const INVALID_TOKENS = "INVALID_TOKENS";
export const AUTHENTICATION = "AUTHENTICATION";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";

const user = (state: UserState = initialState, action: any) => {
  switch (action.type) {
    case AUTHENTICATION:
      return { ...state, loading: true };
    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        logged: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        loading: false,
        logged: false
      };
    case LOG_IN:
      return { ...state, logged: true };
    case LOG_OUT:
      return { ...state, logged: false };
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
    case WIPE_TOKENS:
      return {
        ...state,
        accessToken: "",
        refreshToken: ""
      };
    case INVALID_TOKENS:
      return state;
    default:
      return state;
  }
};

export default user;
