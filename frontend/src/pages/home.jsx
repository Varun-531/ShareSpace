import React from "react";
import VantaClouds from "../components/VantaClouds";


const Home = () => {
  const texts = ["Story","Knowledge","Experience","Passion"];
  return (
    <div className="home-container">
      <VantaClouds texts={texts} small="Welcome to ShareSpace">
      </VantaClouds>
    </div>
  );
};

export default Home;
