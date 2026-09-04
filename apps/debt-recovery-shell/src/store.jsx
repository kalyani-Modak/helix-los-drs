import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import accountReducer from "../../../products/common/slice/accountSlice";

const persistConfig = {
  key: "account",
  storage: storageSession,
  whitelist: ["selectedRow", "headerData"],
};

export const store = configureStore({
  reducer: {
    account: persistReducer(persistConfig, accountReducer),
  },
});

export const persistor = persistStore(store);
