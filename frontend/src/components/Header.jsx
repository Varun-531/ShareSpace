import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  //get the userId from the user cookie
  



  // axios.get("http://localhost:3001/get-username/${}")

  const handleLogout = () => {
    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      toast.success("You have been logged out");
      removeCookie("userId");
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
              src="https://img.icons8.com/color/48/project.png"
              alt="project-management"
            />
          </Link>
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/about"}>About</Link>
            </li>

            <li>
              <Link to={"/login"}>Login</Link>
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
