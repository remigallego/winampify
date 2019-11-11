export type UserState = SpotifyApi.UserObjectPrivate;

export const initialStateUser: UserState = {
  birthdate: "",
  country: "",
  display_name: "",
  email: "",
  external_urls: {
    spotify: ""
  },
  followers: {
    href: "",
    total: 152
  },
  href: "",
  id: "",
  images: [],
  product: "",
  type: "user",
  uri: ""
};

export const SET_USER_INFOS = "SET_USER_INFOS";

const user = (state: UserState = initialStateUser, action: any) => {
  switch (action.type) {
    case SET_USER_INFOS:
      return {
        ...state,
        ...action.payload.userProfile
      };
    default:
      return state;
  }
};

export default user;
