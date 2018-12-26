const initialState = {
  name: "",
  image: "",
  uri: ""
};

const SET_USER_INFOS = "SET_USER_INFOS";

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_INFOS:
      return {
        ...state,
        name: action.name,
        image: action.image,
        uri: action.uri
      };
    default:
      return state;
  }
};

export default user;
