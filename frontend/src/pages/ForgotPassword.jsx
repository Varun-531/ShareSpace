import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["user"]);
  const [jwt, setJwt] = useState("");
  const [otp, setOtp] = useState("");
  const [reset, setReset] = useState(false);
  const [id, setId] = useState("");
  const [first, setFirst] = useState(true);
  const [temp, setTemp] = useState(true);
  const [second, setSecond] = useState(false);
  const handleLogin = async (e) => {
    setLoading(true);
    setFirst(false);
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API + "/email-verification", { email })
      .then((res) => {
        setLoading(false);
        setFirst(false);
        if (res.status === 200) {
          toast.success("OTP Sent Successfully");
          setSecond(true);
        } else {
          toast.error("Failed to send OTP");
        }
      });
  };
  const handleOTP = async (e) => {
    e.preventDefault();
    try {
      const otpResponse = await axios.get(
        process.env.REACT_APP_API + `/get-id/${email}`
      );
      if (otpResponse.status === 200) {
        setId(otpResponse.data.id);
        setJwt(otpResponse.data.token);

        console.log("ID:", otpResponse.data.id);
        console.log(otpResponse.data);
        console.log("JWT:", otpResponse.data.token);
        const otpVerificationResponse = await axios.post(
          process.env.REACT_APP_API + "/otp-verification",
          { email, otp }
        );
        if (otpVerificationResponse.status === 200) {
          toast.success("OTP Verified Successfully");
          setReset(true);
          setTemp(false);
          setSecond(false);
        } else {
          toast.error("Failed to verify OTP");
        }
      } else {
        toast.error("Failed to get OTP");
      }
    } catch (error) {
      console.error("Error handling OTP:", error);
      // toast.error("Error handling OTP");
    }
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <HashLoader
            loading={loading}
            speedMultiplier={1}
            size={30}
            aria-label="Loading Spinner"
          />
        </div>
      )}
      <div className="container1">
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h3 style={{ textAlign: "center" }}>Forgot Password</h3>
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
            {first && (
              <Button variant="primary" className="btt" type="submit">
                Send OTP
              </Button>
            )}
            {second && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  autoComplete="off"
                />
                {temp && (
                  <Button
                    variant="primary"
                    className="btt"
                    type="submit"
                    onClick={handleOTP}
                  >
                    Verify OTP
                  </Button>
                )}
              </>
            )}
            {reset && (
              <Button className="abcd">
                <Link to={`/reset-password/${id}/${jwt}`}>Reset Password</Link>
              </Button>
            )}
            <p>
              Back to <Link to={"/login"}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
