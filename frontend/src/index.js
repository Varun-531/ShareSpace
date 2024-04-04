import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/styles/login.css"
import "./assets/styles/home.css"
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import About from "./pages/About";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Home from "./pages/home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./pages/Logout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/logout",
        element: (
          <PrivateRoute>
            <Logout />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
);
