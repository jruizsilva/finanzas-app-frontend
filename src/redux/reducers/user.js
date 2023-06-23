import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { token } = action.payload;
      return { ...state, token };
    },
    login: (state, action) => {
      const { user } = action.payload;
      return { ...state, user };
    },
    logout: (state, action) => {
      return { ...state, user: null, token: null };
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setToken } = userSlice.actions;

export default userSlice.reducer;
