const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const fetchBlogs = async (req, res) => {
  let bloglist;
  try {
    bloglist = await Blog.find();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
  if (!bloglist) {
    res.status(404).json({ message: "No blogs found" });
  }
  return res.status(200).json(bloglist);
};

const addnewBlog = async (req, res) => {
  const { title, description, image, userId } = req.body;
  const newBlog = new Blog({
    title,
    description,
    image,
    userId,
  });
  try {
    await newBlog.save();
  } catch (err) {
    console.log(err);
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    session.commitTransaction();
  } catch (err) {
    res.send(500).json({ message: err.message });
  }
  return res.status(200).json(newBlog);
};

const deleteBlog = async (req, res) => {
    const id = req.params.id;
    try{
        const findBlog = await Blog.findByIdAndDelete(id);
        if(!findBlog){
            return res.status(404).json({message: "Blog not found"})
        }
        return res.status(200).json({message: "Blog deleted successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
};

const updateBlog = async (req, res) => {
    const id = req.params.id;
    const {title,description,image} = req.body;
    let currentBLog;
    try{
        currentBlog = await Blog.findByIdAndUpdate(id,{
            title,description,image
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
    if(!currentBlog){
        return res.status(404).json({message: "Blog not found"})
    }
    return res.status(200).json({message: "Blog updated successfully"})
}

module.exports = { fetchBlogs, addnewBlog, deleteBlog, updateBlog };