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
  const [otpBox, setOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [button1, setButton1] = useState(true);
  const [button2, setButton2] = useState(false);
  const [button3, SetButton3] = useState(false);
  // const [hashedOtp, setHashedOtp] = useState("");

  const handleVerification = async () => {
    setOtpBox(true);
    try {
      axios
        .post(process.env.REACT_APP_API + "3001/email-verification", { email })
        .then((res) => {
          if (res.status === 200) {
            toast.success("OTP sent successfully");
            setButton1(false);
            setButton2(true);
          } else {
            toast.error("Error please try again");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleOTPVerification = async () => {
    axios
      .post(process.env.REACT_APP_API + `/otp-verification`, { email, otp })
      .then((res) => {
        if (res.status === 200) {
          toast.success("OTP verified successfully");
          setOtpSent(true);
          setButton2(false);
          setButton1(false);
          SetButton3(true);
        } else if (res.status === 400) toast.error("Wrong OTP");
        else {
          toast.error("Error please try again");
        }
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 3) {
      toast.error("Username should be atleast 3 characters long");
    } else if (password.length < 6) {
      toast.error("Password should be atleast 6 characters long");
    } else if (password === confirmpassword) {
      try {
        await axios.post(process.env.REACT_APP_API + "/register", {
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
          {button1 && (
            <Button
              onClick={() => {
                handleVerification();
              }}
            >
              Send Otp
            </Button>
          )}
          {otpBox && (
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
          )}
          {button2 && <Button onClick={handleOTPVerification}>Verify</Button>}
          {otpSent && (
            <>
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
            </>
          )}
          <p>
            Already a user? <Link to={"/login"}>login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
