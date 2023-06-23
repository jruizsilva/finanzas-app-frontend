import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      const transactions = action.payload;
      return { ...state, transactions: transactions };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
