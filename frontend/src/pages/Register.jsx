import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 3) {
      toast.error("Username should be atleast 3 characters long");
    } else if (password.length < 6) {
      toast.error("Password should be atleast 6 characters long");
    } else if (password === confirmpassword) {
      try {
        await axios.post("http://localhost:3001/register", {
          username,
          email,
          password,
        });
        console.log("User created successfully");
        toast.success("User Created");
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Username or email already exists");
        } else {
          console.error(error);
          toast.error("An error occurred. Please try again later.");
        }
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <div className="container1">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Register</h1>
          <input
            type="text"
            value={username}
            name="username"
            id="username"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            //stop auto suggestions
            autoComplete="off"
          />
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
          <input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            autoComplete="off"
          />
          <Button variant="primary" type="submit">
            Register
          </Button>
          <p>
            Already a user? <Link to={"/login"}>login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
