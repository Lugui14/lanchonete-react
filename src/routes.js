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

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<InitialPage />} />
        <Route path="controls" element={<Controls />} />
        <Route path="controls/:idcontrol" element={<EditControl />} />
        <Route path="products" element={<Products />} />
        <Route path="waiters" element={<Waiters />} />
        <Route path="categories" element={<Categories />} />
        <Route path="requests" element={<Requests />} />
      </Route>
    </Routes>
  );
};
