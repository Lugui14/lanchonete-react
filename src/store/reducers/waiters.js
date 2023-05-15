import { createSlice } from "@reduxjs/toolkit";

const waitersSlice = createSlice({
  name: "waiters",
  initialState: {
    idwaiter: null,
    waiter: null,
    salary: null,
  },
  reducers: {
    fetchWaiters: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { fetchWaiters } = waitersSlice.actions;

export default waitersSlice.reducer;
