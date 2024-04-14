import React from "react";
import VantaClouds from "../components/VantaClouds";

const Home = () => {
  const texts = ["Story", "Knowledge", "Experience", "Passion"];
  return (
    <div className="home-container">
      <div className="home-left">
        {/* <img src="https://img.icons8.com/fluency/48/blog.png" alt="No" /> */}
        <div className="home-text">
          Welcome to <span className="home-span">ShareSpace</span>
        </div>
      </div>
      <div className="vanta">
        <VantaClouds texts={texts} small="Welcome to ShareSpace"></VantaClouds>
      </div>
    </div>
  );
};

export default Home;
