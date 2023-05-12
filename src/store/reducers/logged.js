import { createSlice } from "@reduxjs/toolkit";

const loggedSlice = createSlice({
  name: "logged",
  initialState: false,
  reducers: {
    signIn: (state) => {
      state = true;
      return state;
    },
    signOut: (state) => {
      state = false;
      return state;
    },
    isLoginValid: (state) => {
      if (localStorage.getItem("token")) {
        if (localStorage.getItem("loginValidTime") > Date.now()) {
          state = true;
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("loginValidTime");
          state = false;
        }
      }
      return state;
    },
  },
});

export const { signIn, signOut, isLoginValid } = loggedSlice.actions;

export default loggedSlice.reducer;
