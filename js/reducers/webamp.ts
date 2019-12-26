import Webamp, * as WebampInstance from "webamp";

export enum WEBAMP_STATUS {
  PLAYING,
  PAUSED,
  STOPPED
}

export interface WebampState {
  webampObject: Webamp;
  status: WEBAMP_STATUS;
}

export const initialStateWebamp: WebampState = {
  webampObject: null,
  status: WEBAMP_STATUS.STOPPED
};

export const SET_WEBAMP = "SET_WEBAMP";
export const PLAY = "PLAY";

const webamp = (state: WebampState = initialStateWebamp, action: any) => {
  switch (action.type) {
    case SET_WEBAMP:
      return {
        ...state,
        webampObject: action.payload.webampObject
      };
    case PLAY:
      return {
        ...state,
        status: WEBAMP_STATUS.PLAYING
      };
    default:
      return state;
  }
};

export default webamp;
