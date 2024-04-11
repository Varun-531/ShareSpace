import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const Blog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [authorID, setAuthorID] = useState("");
  const [author, setAuthor] = useState("");
  const location = useLocation();
  const { id } = location.state;
  axios
    .get(`http://localhost:3001/fetch-blog/${id}`)
    .then((res) => {
      console.log(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setImage(res.data.image);
      setAuthorID(res.data.userId);
    })
    .catch((err) => {
      console.error(err);
    });
  axios
    .get(`http://localhost:3001/get-username/${authorID}`)
    .then((res) => {
      setAuthor(res.data.username);
    })
    .catch((err) => {
      console.error(err);
    });
  return (
    <div className="Blog">
      {/* <div>Blog ID: {id}</div> */}
      <div className="container4">
        <h3 className="blog-header">{title}</h3>
        <img className="blog-image" src={image} alt="BLog" />
        <p className="blog-p">{description}</p>
        <div>
          <span className="span-author">Author :</span> {author}
        </div>
      </div>
    </div>
  );
};

export default Blog;