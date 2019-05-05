import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducer, { AppState } from "./reducers";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["desktop", "playlist"]
};

const compose = composeWithDevTools({});

const logger = createLogger({});

let initialState;
const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore<AppState>(
  persistedReducer,
  initialState,
  compose(applyMiddleware(thunk, logger))
);

export default store;
