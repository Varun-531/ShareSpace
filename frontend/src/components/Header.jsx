import React from "react";
import { Link } from "react-router-dom";
function Header() {
  return (
    <div>
      <div className="header rounded">
        <div className="header-container">
          <Link to={"/"}>
            <img
              width="100"
              height="100"
              src="https://img.icons8.com/ios/100/project-management.png"
              alt="project-management"
            />
          </Link>
          <ul>
            <li>
              <Link to={"/about"}>About</Link>
            </li>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
            <li>
              <Link to={"/register"}>Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
