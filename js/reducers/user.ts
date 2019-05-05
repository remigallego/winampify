export interface UserState extends SpotifyApi.UserObjectPrivate {
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
}

const initialState: UserState = {
  birthdate: "",
  country: "",
  display_name: "",
  email: "",
  explicit_content: {
    filter_enabled: false,
    filter_locked: false
  },
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

const user = (state: UserState = initialState, action: any) => {
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
