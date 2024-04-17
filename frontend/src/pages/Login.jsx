import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          const userId = res.data.userId;
          //store userId in cookie
          setCookie("userId", userId, { path: "/", maxAge: 24 * 60 * 60 });
          console.log(userId);

          localStorage.setItem("auth-token", res.data.token);
          axios
            .get(`http://localhost:3001/get-username/${userId}`)
            .then((res) => {
              console.log(res.data.username);
              toast.success("Hello " + res.data.username);
            });
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
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            autoComplete="off"
          />
          <Button variant="primary" className="btt" type="submit">
            Login
          </Button>
          <p>
            Dont have an account? <Link to={"/register"}>register</Link>
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
