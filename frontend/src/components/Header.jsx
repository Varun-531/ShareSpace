import React from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (cookies.token) {
      removeCookie("token");
      removeCookie("userId");
      toast.success("You have been logged out");
      navigate("/login");
    } else {
      toast.error("You are not logged in");
    }
  };

  return (
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
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
