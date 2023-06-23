import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import walletReducer from "./reducers/wallet";
import transactionReducer from "./reducers/transactions";

export const store = configureStore({
  reducer: {
    user: userReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
  },
});
