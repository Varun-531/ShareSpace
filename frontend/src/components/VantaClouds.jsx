import React, { useRef, useEffect } from "react";
import CLOUDS from 'vanta/src/vanta.clouds'

const VantaClouds = ({ children ,text,small}) => {
  const vantaRef = useRef(null);
  const vantaInstance = useRef(null);

  useEffect(() => {
    vantaInstance.current = CLOUDS({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      speed: 1.90,
    });

    // Clean up when the component unmounts
    return () => {
      if (vantaInstance.current) {
        vantaInstance.current.destroy();
      }
    };
  }, []);

  return <div className="vantaContainer" ref={vantaRef}>{children}<h1>{text}</h1><p>{small}</p></div>;
};

export default VantaClouds;
