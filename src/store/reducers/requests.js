import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    idrequest: null,
    idcontrol: null,
    product: null,
    vlvenda: null,
    requeststatus: null,
  },
  reducers: {
    fetchRequests: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { fetchRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
