import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wallet: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      const wallet = action.payload;
      return { ...state, wallet };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
