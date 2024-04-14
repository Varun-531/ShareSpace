import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const handleLogout = () => {
    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      toast.success("You have been logged out");
      removeCookie("userId");
    } else {
      toast.error("You are not logged in");
    }
  };

  return (
    <div>
      <div className="header">
        <div className="header-container">
         <Link to={"/"}>
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/fluency/48/blog.png"
              alt="project-management"
            />
          </Link>
          
          <ul>
            <li>
              <Link to={"/dashboard"}>Blogs</Link>
            </li>
            <li>
              <Link to={"/create-post"}>Create Blog</Link>
            </li>
            <li>
              <Link to={"/author-post"}>Your Posts</Link>
            </li>
            <li>
              <Link to={"/logout"} onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
