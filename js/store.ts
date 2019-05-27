import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { createMigrate, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import reducer, { AppState, initialStateApp } from "./reducers";

const migrations = {
  0: (state: AppState) => {
    // migration clear out device state
    return initialStateApp;
  }
};

const persistConfig = {
  key: "root",
  version: 0,
  storage,
  whitelist: ["desktop"],
  // @ts-ignore
  migrate: createMigrate(migrations, { debug: false })
};

const compose = composeWithDevTools({});

const logger = createLogger({});

const persistedReducer = persistReducer(persistConfig, reducer);
let middlewares;

if (process.env.NODE_ENV !== "development") {
  middlewares = compose(applyMiddleware(thunk, logger));
} else {
  middlewares = applyMiddleware(thunk);
}

const store = createStore<AppState>(
  persistedReducer,
  initialStateApp,
  middlewares
);

export default store;
