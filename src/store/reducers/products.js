import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    idproduct: null,
    product: null,
    price: null,
    description: null,
    category: null,
  },
  reducers: {
    fetchProducts: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { fetchProducts } = productsSlice.actions;

export default productsSlice.reducer;
