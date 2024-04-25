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
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [description_2, setDescription_2] = useState("");
  // const handleCreatePost = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", image);
  //   axios
  //     .post("http://localhost:3001/upload-image", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       try {
  //         console.log(res.data.url);
  //         setImageUrl(res.data.url);
  //         axios
  //           .post("http://localhost:3001/add-blog", {
  //             title: title,
  //             description: description,
  //             description_2: description_2,
  //             image: res.data.url,
  //             userId: userId,
  //           })
  //           .then((res) => {
  //             if (res.status === 200) {
  //               toast.success("Post created successfully");
  //               navigate("/Dashboard");
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             toast.error("An error occurred. Please try again later.");
  //           });
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     });
  // };
  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("description_2", description_2);
    formData.append("userId", userId);
    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost:3001/add-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="container2">
      <div className="creatBlog">
        {/* <Button onClick={handleHome}>Back to Home</Button> */}
        <form className="create-blog-form" onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Title"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <br />
          {/* <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
          /> */}
          <input
            type="file"
            name="Image"
            id="Image"
            onChange={(e) => setImage(e.target.files[0])}
            accept="png, jpg, jpeg"
          />
          {/* <input
            type="text"
            name="Description_2"
            id="description"
            placeholder="Enter Description"
            onChange={setDescription_2}
          /> */}
          <ReactQuill
            value={description_2}
            id="Description2"
            placeholder="Enter Description"
            onChange={(content, delta, source, editor) => {
              setDescription_2(editor.getHTML()); // Use editor.getHTML() to get the HTML content
            }}
          />

          <input type="hidden" value={userId} />
          <ReactQuill
            className="description"
            modules={modules}
            formats={formats}
            value={description}
            placeholder="Enter Content"
            onChange={setDescription}
          />
          <Button type="submit" className="btn primary">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePosts;
