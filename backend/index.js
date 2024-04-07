const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ProjectX", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Check MongoDB connection status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connected successfully");
});

app.post("/login", async (req, res) => {
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
    else {
      const data = {
        user: {
          id: user._id,
        },
      };
      const token = jwt.sign(data, "Project-X");
      return res.json({ success: true, token });
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

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body; // Removed unnecessary .email
  try {
    const user = await User.findOne({ email: email }); // Simplified findOne query
    if (!user) {
      return res.status(404).send({ Status: "User not Existed" }); // Return a clear response
    }

    const token = jwt.sign({ id: user._id }, "forget_password", {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "no-replyprojecty@hotmail.com", 
        pass: "myheroacademia@2", 
      },
    });

    const mailOptions = {
      from: "no-replyprojecty@hotmail.com",
      to: email, 
      subject: "Reset your Password",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).send({ Status: "Failed to send email" }); // Handle email sending failure
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).send({ Status: "Success" }); // Send success response
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ Status: "Internal Server Error" }); // Handle internal server error
  }
});

app.post("/reset-password/:id/:token",  (req, res) => {
  const {id, token} = req.params;
  const {password} = req.body;
  jwt.verify(token, "forget_password", (err,decoded)=>{
    if(err){
      return res.send({Status:"Error with Token"});
    }
    else{
      bcrypt.hash(password,10).then((hash)=>{
        User.findByIdAndUpdate({_id:id},{password:hash})
        .then(u =>res.send({Status:"Password Updated"}))
        .catch(err=>res.send({Status:"Error Updating Password"}))
      })
      .catch(err=>res.send({Status:"Error Hashing Password"}))
    }
  })
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
