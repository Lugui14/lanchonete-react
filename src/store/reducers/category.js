import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    idcategory: null,
    category: null,
    description: null,
  },
  reducers: {
    fetchCategories: (state, { payload }) => {
      state = payload;
      return state;
    },
  },
});

export const { fetchCategories } = categorySlice.actions;

export default categorySlice.reducer;
