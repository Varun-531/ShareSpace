import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <>
      <Toaster />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
