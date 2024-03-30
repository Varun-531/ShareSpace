const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ProjectX");

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
