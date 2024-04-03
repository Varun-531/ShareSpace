import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Login Successful", {
            duration: 5000,
          });
          console.log(res);
          localStorage.setItem("auth-token", res.data.token);
          navigate("/Dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button variant="primary" type="submit">
            Login
          </Button>
        </form>
        <Link to={"/register"}>
          <Button variant="primary">Register</Button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
