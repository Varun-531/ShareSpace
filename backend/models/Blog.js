//create a schema for blog page
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      min: 6,
    },
    description_2: {
      type: String,
      required: true,
      min: 6,
    },
    image: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", userSchema);
