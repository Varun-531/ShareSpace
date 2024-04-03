const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ProjectX", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check MongoDB connection status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully");
});

app.post("/login",async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json("User not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json("Wrong password");
    }
    // If user and password match, send success response
    // return res.json("Login successful");
    else{
      const data = {
        user:{
          id: user._id
        }
      }
      const token = jwt.sign(data, "Project-X");
      return res.json({success: true, token});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser
    .save()
    .then(() => {
      const data = {
        user: {
          id: newUser._id,
        },
      };
      const token = jwt.sign(data, "Project-X");
      console.log("User created successfully");
      res.json({ success: true, token });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // MongoDB duplicate key error code
        res.status(400).json("Username or email already exists");
      } else {
        console.error(err);
        res.status(500).json("Internal Server Error");
      }
    });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
