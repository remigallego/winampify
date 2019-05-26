export enum LOADING {
  NONE,
  LOGGING_IN,
  LOGGING_OUT
}

export interface AuthState {
  logged: boolean;
  loading: LOADING;
  error: boolean;
  errorMessage: string;
  accessToken: string;
  refreshToken: string;
}

export const initialStateAuth: AuthState = {
  logged: false,
  loading: LOADING.NONE,
  error: false,
  errorMessage: "",
  accessToken: "",
  refreshToken: ""
};

export const LOG_OUT = "LOG_OUT";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const WIPE_TOKENS = "WIPE_TOKENS";
export const AUTHENTICATION = "AUTHENTICATION";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";

const auth = (state: AuthState = initialStateAuth, action: any) => {
  switch (action.type) {
    case AUTHENTICATION:
      return { ...state, loading: LOADING.LOGGING_IN, errorMessage: "" };
    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        loading: LOADING.NONE,
        logged: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        loading: LOADING.NONE,
        logged: false,
        errorMessage: action.payload.message
      };
    case LOG_OUT:
      return { ...state, logged: false, loading: LOADING.LOGGING_OUT };
    case LOG_OUT_SUCCESS:
      return { ...state, loading: LOADING.NONE };
    case WIPE_TOKENS:
      return {
        ...state,
        accessToken: "",
        refreshToken: ""
      };
    default:
      return state;
  }
};

export default auth;
