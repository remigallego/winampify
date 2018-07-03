import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import reducer from "./reducers";
// import mediaMiddleware from "./mediaMiddleware";
import spotifyMiddleware from "./spotifyMiddleware";
import { merge } from "./utils";
import { UPDATE_TIME_ELAPSED, STEP_MARQUEE } from "./actionTypes";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["desktop", "playlist"] // only desktop will be persisted
};

const compose = composeWithDevTools({
  actionsBlacklist: [UPDATE_TIME_ELAPSED, STEP_MARQUEE]
});

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== STEP_MARQUEE && action.type !== UPDATE_TIME_ELAPSED
});

const getStore = (media, stateOverrides) => {
  let initialState;
  if (stateOverrides) {
    initialState = merge(
      reducer(undefined, { type: "@@init" }),
      stateOverrides
    );
  }
  const persistedReducer = persistReducer(persistConfig, reducer);

  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(thunk, spotifyMiddleware(media), logger))
  );
};
export default getStore;
