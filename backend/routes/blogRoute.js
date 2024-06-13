const express = require("express");
const BlogRouter = express.Router();

const {
  fetchBlogs,
  addnewBlog,
  deleteBlog,
  updateBlog,
} = require("../controller/blog-controller");

BlogRouter.get("/", fetchBlogs);
BlogRouter.post("/add", addnewBlog);
BlogRouter.delete("/delete/:id", deleteBlog);
BlogRouter.put("/update/:id", updateBlog);

module.exports = BlogRouter;