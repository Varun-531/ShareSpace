import React from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleLogin = (e) => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      e.preventDefault();
      axios
        .post(process.env.REACT_APP_API + `/reset-password/${id}/${token}`, {
          password: password,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Password updated successfully", {
              // duration: 5000,
            });
            navigate("/login");
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
    }
  };
  return (
    <div className="container1">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Update Password</h1>
          <input
            type="password"
            name="email"
            id="email"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            autoComplete="off"
          />
          <input
            type="password"
            name="email"
            id="email"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            autoComplete="off"
          />
          <Button variant="primary" className="btt" type="submit">
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
