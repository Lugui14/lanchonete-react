import { configureStore } from "@reduxjs/toolkit";

import loggedReducer from "./reducers/logged";

const store = configureStore({
  reducer: {
    logged: loggedReducer,
  },
});

export default store;
