import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API + "/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          const userId = res.data.userId;
          setCookie("userId", userId, { path: "/", maxAge: 24 * 60 * 60 });
          setCookie("token", res.data.token, {
            path: "/",
            maxAge: 3 * 60 * 60,
          });
          axios
            .get(process.env.REACT_APP_API + `/get-username/${userId}`)
            .then((res) => {
              toast.success("Welcome " + res.data.username);
              navigate("/dashboard");
            })
            .catch((err) => {
              console.error("Error fetching username:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.response && err.response.status === 401) {
          toast.error("Email or password is incorrect");
        } else if (err.response && err.response.status === 404) {
          toast.error("User not found");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <div className="container1">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <Button variant="primary" className="btt" type="submit">
            Login
          </Button>
          <p>
            Don't have an account? <Link to={"/register"}>Register</Link>
          </p>
          <p>
            <Link to={"/forgot-password"}>Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
