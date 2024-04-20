import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Blog = () => {
  const [blogData, setBlogData] = useState({});
  const [author, setAuthor] = useState("");
  const location = useLocation();
  const { id } = location.state;

  useEffect(() => {
    axios
      .get(`http://localhost:3001/fetch-blog/${id}`)
      .then((res) => {
        setBlogData(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/get-username/${blogData.userId}`)
      .then((res) => {
        setAuthor(res.data.username);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [blogData]);

  return (
    <div className="Blog">
      <div className="container4">
        <h3 className="blog-header">{blogData.title}</h3>
        <img className="blog-image" src={blogData.image} alt="Blog" />
        <ReactQuill
          className="blog-content"
          value={blogData.description || ""}
          readOnly={true}
        />
        <div className="blog1-footer">
          <div>
            <span className="span-author">Author :</span> {author}
          </div>
          <div className="blog-footer2">
            <span className="span-author">Created : </span>
            {format(blogData.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
