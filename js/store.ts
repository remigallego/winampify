import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import reducer from "./reducers";
import spotifyMiddleware from "./spotifyMiddleware";
import { merge } from "./utils";
import { UPDATE_TIME_ELAPSED, STEP_MARQUEE, SET_MEDIA } from "./actionTypes";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["desktop", "playlist", "user"] // only desktop will be persisted
};

const compose = composeWithDevTools({
  actionsBlacklist: [UPDATE_TIME_ELAPSED, STEP_MARQUEE]
});

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== STEP_MARQUEE &&
    action.type !== UPDATE_TIME_ELAPSED &&
    action.type !== SET_MEDIA
});

const getStore = (media: any, stateOverrides: any) => {
  let initialState;
  if (stateOverrides) {
    initialState = merge(reducer, stateOverrides);
  }
  const persistedReducer = persistReducer(persistConfig, reducer);

  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(thunk, logger, spotifyMiddleware(media)))
  );
};
export default getStore;
