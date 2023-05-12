import React from "react"

import {
  createBrowserRouter,
} from "react-router-dom";

import { Root } from "./pages/Root";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: []
  },
]);

export default router;