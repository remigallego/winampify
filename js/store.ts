import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer from "./reducers";
import { UPDATE_TIME_ELAPSED, STEP_MARQUEE, SET_MEDIA } from "./actionTypes";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["desktop", "playlist", "user"]
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

const getStore = () => {
  let initialState;
  const persistedReducer = persistReducer(persistConfig, reducer);

  return createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(thunk, logger))
  );
};
export default getStore;
