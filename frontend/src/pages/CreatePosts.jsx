import React from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const userId = cookies.userId;
  const handleHome = () => {
    navigate("/Dashboard");
  };
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const handleCreatePost = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/add-blog", {
        title: title,
        description: description,
        image: image,
        userId: userId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Post created successfully");
          navigate("/Dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred. Please try again later.");
      });
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  return (
    <div className="creatBlog">
      <Button onClick={handleHome}>Back to Home</Button>
      <h2>Create Post</h2>
      <form className="create-blog-form" onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <br />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
          }}
        />
        <input type="hidden" value={userId} />
        <ReactQuill
          modules={modules}
          formats={formats}
          value={description}
          onChange={setDescription}
        />
        <Button type="submit" className="btn primary">
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreatePosts;
