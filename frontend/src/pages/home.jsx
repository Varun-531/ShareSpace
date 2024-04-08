import React from "react";
import VantaClouds from "../components/VantaClouds";


const Home = () => {
  const texts = ["Hello", "Welcome to 123", "my Project"];
  return (
    <div className="home-container">
      <VantaClouds texts={texts} small="sample">
        {/* Your content here */}
      </VantaClouds>
    </div>
  );
};

export default Home;
