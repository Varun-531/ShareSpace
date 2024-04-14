import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <div className="container01">
      {!isHomePage && <Header />}
      <Outlet />
      {!isHomePage && <Footer />}
    </div>
  );
};

export default Layout;
