import React from "react";
import { useCookies } from "react-cookie";
import axios from "axios";  
import { useState } from "react";


const Dashboard = () => {
  const [cookies,setCookie] = useCookies(["user"]);
  const [username, setUsername] = useState("");
  const userId = cookies.userId;
  axios.get(`http://localhost:3001/get-username/${userId}`)
  .then(res =>{
    setUsername(res.data.username);
  })
  return (
    <div className="dashboard">
    </div>
  );
};

export default Dashboard;
