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
  // const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
      });
      console.log("User created successfully");
      toast.success("User Created");
      navigate("/login");
      // Redirect or show success message
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // setErrorMessage("Username or email already exists");
        toast.error("Username or email already exists");
      } else {
        console.error(error);
        toast.error("An error occurred. Please try again later.");
        // setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="container1">
      {/* <Toaster/> */}
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
          />
          <Button variant="primary" type="submit">
            Register
          </Button>
          <p>
            Already a user? <Link to={"/login"}>login</Link>
          </p>
          {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default Register;
