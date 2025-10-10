
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import ShowChant from "./ShowChant";
import ShowDetailChant from "./ShowDetailChant";
import EditChant from "./EditChant";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="showChants" element={<ShowChant />} />
      <Route path="showChants/:Idchant" element={<ShowDetailChant />} />
      <Route path="editChant/:Idchant" element={<EditChant />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
