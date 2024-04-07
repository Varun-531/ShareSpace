import React from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forgot-password", {
        email: email,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Email sent successfully", {
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
  };
  return (
    <div className="container1">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h3 style={{textAlign:"center"}}>Forgot Password</h3>
          {/* <label htmlFor="email">Email</label> */}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
          />
          <Button variant="primary" className="btt" type="submit">
            Send
          </Button>
          {/* <p><Link to={"/forgot-password"}>Forgot Password</Link></p> */}
        </form>
        
      </div>
    </div>
  );
};

export default ForgotPassword;
