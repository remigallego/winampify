import { Action } from "redux";

export interface UserState {
  name: string;
  image: string;
  uri: string;
  logged: boolean;
}

const initialState: UserState = {
  name: "",
  image: "",
  uri: "",
  logged: false
};

const SET_USER_INFOS = "SET_USER_INFOS";

const user = (state: UserState = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_INFOS:
      return {
        ...state,
        name: action.name,
        image: action.image,
        uri: action.uri,
        logged: true
      };
    default:
      return state;
  }
};

export default user;
