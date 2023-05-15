import { configureStore } from "@reduxjs/toolkit";

import loggedReducer from "./reducers/logged";
import controlsReducer from "./reducers/controls";
import productsReducer from "./reducers/products";
import categoriesReducer from "./reducers/category";
import waitersReducer from "./reducers/waiters";
import requestsReducer from "./reducers/requests";


const store = configureStore({
  reducer: {
    logged: loggedReducer,
    controls: controlsReducer,
    products: productsReducer,
    categories: categoriesReducer,
    waiters: waitersReducer,
    requests: requestsReducer
  },
});

export default store;
