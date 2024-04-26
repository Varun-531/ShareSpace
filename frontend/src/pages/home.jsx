import React, { useState, useEffect } from "react";
import VantaClouds from "../components/VantaClouds";
import HashLoader from "react-spinners/HashLoader";

const Home = () => {
  const texts = ["Story", "Knowledge", "Experience", "Passion"];
  const [loading, setLoading] = useState(true); // Initially set loading to true
  useEffect(() => {
    // Simulating a delay with setTimeout to mimic data loading
    setTimeout(() => {
      setLoading(false); // Set loading to false after 4000 milliseconds (4 seconds)
    }, 4000);
  }, []);
  return (
    <>
      {loading && ( // Render loading spinner if loading is true
        <div className="loader-overlay">
          <HashLoader
            loading={loading}
            speedMultiplier={1}
            size={30}
            aria-label="Loading Spinner"
          />
        </div>
      )}
      <div className="home-container">
        <div className="home-left">
          <div className="home-text">
            Welcome to <span className="home-span">ShareSpace</span>
          </div>
        </div>
        <div className="vanta">
          <VantaClouds
            texts={texts}
            small="Welcome to ShareSpace"
          ></VantaClouds>
        </div>
      </div>
    </>
  );
};

export default Home;
