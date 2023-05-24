import React from "react";

import { Route, Routes } from "react-router-dom";

import { Root } from "./pages/Root";
import { Controls } from "./pages/Controls";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Waiters } from "./pages/Waiters";
import { Requests } from "./pages/Requests";
import { InitialPage } from "./pages/InitialPage";
import { EditControl } from "./pages/Controls/EditControl";
import { EditProduct } from "./pages/Products/EditProduct";
import { EditCategory } from "./pages/Categories/EditCategory";
import { EditWaiter } from "./pages/Waiters/EditWaiter";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<InitialPage />} />
        <Route path="controls" element={<Controls />} />
        <Route path="controls/:idcontrol" element={<EditControl />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:idproduct" element={<EditProduct />} />
        <Route path="waiters" element={<Waiters />} />
        <Route path="waiters/:idwaiter" element={<EditWaiter />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:idcategory" element={<EditCategory />} />
        <Route path="requests" element={<Requests />} />
      </Route>
    </Routes>
  );
};
