const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/user");
const Blog = require("./models/Blog");
const Otp = require("./models/Otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const session = require("express-session");
const BlogRouter = require("./routes/blogRoute");
const otpGenerator = require("otp-generator");
const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "dp1gjfgmg",
  api_key: "973866118168666",
  api_secret: "hJTdoFtZiFavz4kS10rjKihjrOY",
  secure: true,
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

mongoose
  .connect(
    "mongodb+srv://21pa1a0531:JU5kGfUf5niBZreG@eventscluster.aoyo1zs.mongodb.net/BlogWebsite"
    // "mongodb+srv://emcommerce-admin:123456780@cluster0.z8jcujg.mongodb.net/EventManager"
  )
  .then(() => console.log(`${mongoose.connection.name}`))
  .catch((err) => console.log(err));

// Check MongoDB connection status
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("MongoDB connected successfully");
// });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }
  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(400).json({ message: "Invalid token" });
  }
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res.status(401).json({ message: "Access Denied" });
//   }
//   const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
//   console.log("Token:", token);
//   if (!token) {
//     return res.status(401).json({ message: "Access Denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, "SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return res.status(400).json({ message: "Invalid token" });
//   }
// };

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "3h" });
    return res.json({ success: true, token, userId: user.id });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email, password);

//   try {
//     const user = await User.findOne({ email });
//     console.log(user);
//     if (!user) {
//       return res.status(404).json("User not found");
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json("Wrong password");
//     } else {
//       req.session.user = {
//         id: user._id,
//       };
//       const data = {
//         user: {
//           id: user._id,
//         },
//       };
//       const token = jwt.sign(data, "SECRET_KEY", { expiresIn: "3h" });
//       console.log(req.session);
//       return res.json({ success: true, token, userId: user._id });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json("Internal Server Error");
//   }
// });

//route for email verification
app.post("/email-verification", async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log(otp);
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.REACT_APP_EMAIL_2,
      pass: process.env.REACT_APP_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.REACT_APP_EMAIL_2,
    to: email,
    subject: "OTP for Email Verification",
    text: `Your OTP is: ${otp}`,
  };

  const hashedOtp = await bcrypt.hash(otp, 10);
  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).send({ Status: "Failed to send email" });
    } else {
      try {
        // Delete existing OTP with the same email
        await Otp.deleteOne({ email });

        const newOtp = new Otp({
          email,
          otp: hashedOtp,
        });
        await newOtp.save();
        console.log("OTP SAVED");
        console.log("Email sent:", info.response);
        return res.status(200).send({ Status: "Success" });
      } catch (err) {
        console.error(err);
        return res.status(500).send({ Status: "Internal Server Error" });
      }
    }
  });
});

//get id from email
app.get("/get-id/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const token = jwt.sign({ id: user._id }, "forget_password", {
      expiresIn: "1d",
    });
    return res.json({ id: user._id, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/otp-verification", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpData = await Otp.findOne({ email });
    if (otpData) {
      const match = await bcrypt.compare(otp, otpData.otp);
      if (match) {
        return res.status(200).send({ Status: "OTP Verified" });
      } else {
        return res.status(400).send({ Status: "Wrong OTP" });
      }
    } else {
      return res.status(404).send({ Status: "OTP not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ Status: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();
    return res.json(newUser);
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
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
        user: process.env.REACT_APP_EMAIL_2,
        pass: process.env.REACT_APP_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.REACT_APP_EMAIL_2,
      to: email,
      subject: "Click on the Link to Reset your Password",
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
    return res.status(500).send({ Status: "Internal Server Error" });
  }
});

app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, "forget_password", (err, decoded) => {
    if (err) {
      return res.send({ Status: "Error with Token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Password Updated" }))
            .catch((err) => res.send({ Status: "Error Updating Password" }));
        })
        .catch((err) => res.send({ Status: "Error Hashing Password" }));
    }
  });
});

//create a route that returns the username of the user from id
app.get("/get-username/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

// app.use("/blog", BlogRouter);
//*****************************************blog routes*****************************************//
// app.post("/add-blog", async (req, res) => {
//   const { title, description, image, userId } = req.body;
//   const newBlog = new Blog({
//     title,
//     description,
//     description_2,
//     image,
//     userId,
//   });
//   try {
//     await newBlog.save();
//     console.log("Blog Created");
//     return res.status(200).json(newBlog);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json("Internal Server Error");
//   }
// });

const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Ensure multer is properly configured

app.post("/add-blog", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description, userId, description_2 } = req.body;
  const image = req.file ? req.file.path : null; // Check if an image was uploaded

  try {
    let imageUrl = null;
    if (image) {
      console.log("Image Uploading");
      const result = await cloudinary.v2.uploader.upload(image);
      console.log("Image Uploaded");
      imageUrl = result.url;
    }

    const newBlog = new Blog({
      title,
      description,
      image: imageUrl, // Assign the image URL to the blog
      userId,
      description_2,
    });

    await newBlog.save();
    console.log("Blog Created");
    return res.status(200).json(newBlog);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

//new route that takes the image i give and uploads it to cloudinary with id as email and returns the url
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // replace 'uploads/' with your desired path

// app.post("/upload-image", upload.single('image'), async (req, res) => {
//   try {
//     console.log("Image Uploading");
//     const result = await cloudinary.v2.uploader.upload(req.file.path);
//     console.log("Image Uploaded");
//     return res.status(200).json({ id: result.public_id, url: result.url });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json("Internal Server Error");
//   }
// });

app.get("/fetch-blogs", async (req, res) => {
  try {
    const bloglist = await Blog.find();
    if (!bloglist) {
      return res.status(404).json("No blogs found");
    }
    return res.status(200).json(bloglist);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

app.delete("/delete-blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findBlog = await Blog.findByIdAndDelete(id);
    if (!findBlog) {
      return res.status(404).json("Blog not found");
    }
    return res.status(200).json("Blog deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

//update route
app.post("/update-blog/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, image, description_2 } = req.body;
  try {
    const currentBlog = await Blog.findByIdAndUpdate(id, {
      title,
      description,
      image,
      description_2,
    });
    return res.status(200).json(currentBlog);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

//fetch the blogs by userId
app.get("/fetch-blogs/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const bloglist = await Blog.find({ userId });
    if (!bloglist) {
      return res.status(404).json("No blogs found");
    }
    return res.status(200).json(bloglist);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});
//fetch the blog by id
app.get("/fetch-blog/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json("No blog found");
    }
    return res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
