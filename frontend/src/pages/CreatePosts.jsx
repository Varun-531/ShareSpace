import React from "react";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const CreatePosts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["user"]);
  const userId = cookies.userId;
  const handleHome = () => {
    navigate("/Dashboard");
  };
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [description_2, setDescription_2] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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
      ["link"],
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
  ];

  // Update the image input change handler to set the imageUrl state
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file)); // Create a temporary URL for the selected image
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <HashLoader
            loading={loading}
            speedMultiplier={1}
            size={30}
            aria-label="Loading Spinner"
          />
        </div>
      )}
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
            {/* Display the selected image */}
            {imageUrl && <img src={imageUrl} alt="Selected" style={{ maxWidth: "100%" }} />}
            <input
              type="file"
              name="Image"
              id="Image"
              onChange={handleImageChange}
              accept="png, jpg, jpeg"
            />
            <ReactQuill
              value={description_2}
              id="Description2"
              className="description2"
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
    </>
  );
};

export default CreatePosts;
