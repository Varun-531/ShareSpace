import React, { useRef, useEffect, useState } from "react";
import CLOUDS from "vanta/src/vanta.clouds";
import useTypewriter from "react-typewriter-hook";

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

    // Clean up when the component unmounts
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
    }, 2000); // Change text every 3 seconds, adjust as needed

    return () => clearInterval(intervalId);
  }, [texts]);

  return (
    <div className="vantaContainer" ref={vantaRef}>
      {children}
      <h1>{small}</h1>
      <p>{typedText}</p>
    </div>
  );
};

export default VantaClouds;
