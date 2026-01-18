
import React from "react";
import "./styles/App.css";
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
import Profile from "./pages/Profile";
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="showChants" element={<RequireAuth><ShowChant /></RequireAuth>} />
      <Route path="showChants/:Idchant" element={<ShowDetailChant />} />
      <Route path="editChant/:Idchant" element={<RequireAuth><EditChant /></RequireAuth>} />
      <Route path="admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
      <Route path="editUser/:IdUser" element={<RequireAuth><EditUser /></RequireAuth>} />
      <Route path="favoris" element={<RequireAuth><Favoris /></RequireAuth>} />
      <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="forgot-password" element={<ForgotPassword/>} /> 
      <Route path="*" element={<PageNotFound/>} />
    </Route>
  )
);

import { AuthProvider } from "./hooks/useAuth";
import ToastProvider from "./components/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
