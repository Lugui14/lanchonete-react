import { createSlice } from "@reduxjs/toolkit";

const controlsSlice = createSlice({
  name: "controls",
  initialState: {
    idcontrol: null,
    client: null,
    waiter: null,
    numbercontrol: null,
  },
  reducers: {
    fetch: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { fetch } = controlsSlice.actions;

export default controlsSlice.reducer;
