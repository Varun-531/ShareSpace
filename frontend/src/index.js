import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import About from "./pages/About";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Home from "./pages/home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {path:"/about",element:<About/>},
      {path:"/login",element:<Login />},
      {path:"/register",element:<Register />},
  ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
