import React, { useRef, useEffect, useState } from "react";
import CLOUDS from "vanta/src/vanta.clouds";
import useTypewriter from "react-typewriter-hook";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VantaClouds = ({ children, texts, small }) => {
  const vantaRef = useRef(null);
  const vantaInstance = useRef(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const typedText = useTypewriter(texts[currentTextIndex]);

  useEffect(() => {
    vantaInstance.current = CLOUDS({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      speed: 1.9,
    });

    return () => {
      if (vantaInstance.current) {
        vantaInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === texts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [texts]);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("./login");
  };

  return (
    <div className="vantaContainer" ref={vantaRef}>
      {children}
      <h1>
        Share your <span>{typedText}</span>
      </h1>
      <Button
        onClick={() => {
          handleLogin();
        }}
        className="vanta-button"
      >
        Login/Signup
      </Button>
    </div>
  );
};

export default VantaClouds;
