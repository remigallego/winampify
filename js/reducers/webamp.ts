import Webamp, * as WebampInstance from "webamp";

export interface WebampState {
  instance: Webamp;
}

export const initialStateWebamp: WebampState = {
  instance: null
};

export const SET_WEBAMP = "SET_WEBAMP";

const webamp = (state: WebampState = initialStateWebamp, action: any) => {
  switch (action.type) {
    case SET_WEBAMP:
      return {
        ...state,
        instance: action.payload.webamp
      };
    default:
      return state;
  }
};

export default webamp;
