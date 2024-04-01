import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
      });
      console.log("User created successfully");
      // Redirect or show success message
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Username or email already exists");
      } else {
        console.error(error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="userName">UserName</label>
          <input
            type="text"
            value={username}
            name="username"
            id="username"
            placeholder="Enter your Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
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
            Register
          </Button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <Link to={"/login"}>
          <Button variant="primary">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default Register;
