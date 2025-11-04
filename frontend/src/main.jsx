
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowChant from "./pages/ShowChant";
import ShowDetailChant from "./pages/ShowDetailChant";
import EditChant from "./pages/EditChant";
import AdminPage from "./components/AdminPage";
import EditUser from "./components/EditUser";
import Favoris from "./pages/Favoris";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="showChants" element={<ShowChant />} />
      <Route path="showChants/:Idchant" element={<ShowDetailChant />} />
      <Route path="editChant/:Idchant" element={<EditChant />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="editUser/:IdUser" element={<EditUser />} />
      <Route path="favoris" element={<Favoris />} />
      <Route path="forgot-password" element={<ForgotPassword/>} /> 
      <Route path="*" element={<PageNotFound/>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
