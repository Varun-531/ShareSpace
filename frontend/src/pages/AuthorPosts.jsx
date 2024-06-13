import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { format } from "timeago.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import HashLoader from "react-spinners/HashLoader";

const AuthorPosts = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [cookies] = useCookies(["user"]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const userId = cookies.userId;
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDescription_2, setEditDescription_2] = useState("");
  const [editImage, setEditImage] = useState("");
  const [loading, setLoading] = useState(true);
  console.log("cookie", cookies.token);
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
    // "image",
  ];
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API + `/fetch-blogs/${userId}`)
      .then((response) => {
        // console.log(response.data);
        setBlogsList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  const handleEdit = (id, title, description, image, description_2) => {
    setSelectedBlog({ _id: id, title, description, image, description_2 });
    setEditTitle(title);
    setEditDescription(description);
    setEditDescription_2(description_2);
    setEditImage(image);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(process.env.REACT_APP_API + `/delete-blog/${id}`)
      .then((response) => {
        // console.log(response.data);
        // Filter out the deleted blog from the blogsList
        const updatedBlogsList = blogsList.filter((blog) => blog._id !== id);
        setBlogsList(updatedBlogsList);
        toast.success("Blog deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleSaveEdit = () => {
  //   axios
  //     .post(
  //       process.env.REACT_APP_API + `/update-blog/${selectedBlog._id}`,
  //       {
  //         title: editTitle,
  //         description: editDescription,
  //         description_2: editDescription_2,
  //         image: editImage,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${cookies.token}`,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const updatedBlogsList = blogsList.map((blog) =>
  //         blog._id === selectedBlog._id ? response.data : blog
  //       );
  //       setBlogsList(updatedBlogsList);
  //       setShowModal(false);
  //       toast.success("Blog updated successfully");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleSaveEdit = () => {
    if (!process.env.REACT_APP_API) {
      console.error("API URL is not defined in the environment variables");
      return;
    }

    if (!cookies.token) {
      console.error("Authorization token is missing");
      return;
    }
    console.log("selectedBlog");
    axios
      .post(
        `${process.env.REACT_APP_API}/update-blog/${selectedBlog._id}`,
        {
          title: editTitle,
          description: editDescription,
          description_2: editDescription_2,
          image: editImage,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then((response) => {
        const updatedBlogsList = blogsList.map((blog) =>
          blog._id === selectedBlog._id ? response.data : blog
        );
        setBlogsList(updatedBlogsList);
        setShowModal(false);
        toast.success("Blog updated successfully");
      })
      .catch((err) => {
        console.error("Error updating blog:", err);
        toast.error("Failed to update blog. Please try again.");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const shortenDescription = (description_2) =>
    description_2.length > 200
      ? description_2.substr(0, 200) + "..."
      : description_2;

  const shortenTitle = (title) =>
    title.length > 20 ? title.substr(0, 20) + "..." : title;

  return (
    <div>
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
      <h1 id="yourposts">Your Posts</h1>
      <div className="main-container">
        <div className="blogs-container">
          {blogsList.length === 0 ? (
            <p>No blogs available</p>
          ) : (
            blogsList.map((blog) => (
              <article key={blog._id} className="blog blog2">
                <div className="blog-header">
                  <img className="blog-img" src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-info">
                  <h3>{shortenTitle(blog.title)}</h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: shortenDescription(blog.description_2),
                    }}
                  ></p>
                </div>
                <div className="blog-footer">
                  <p className="p-time">
                    <span className="span-author">Created : </span>
                    {format(blog.createdAt)}
                  </p>
                  <div className="blog-buttons">
                    <i
                      className="fi fi-rr-file-edit edit-icon"
                      onClick={() =>
                        handleEdit(
                          blog._id,
                          blog.title,
                          blog.description,
                          blog.image,
                          blog.description_2 // Pass description_2 to handleEdit
                        )
                      }
                    ></i>
                    {/* <MdDeleteForever
                      className="delete-icon"
                      onClick={() => handleDelete(blog._id)}
                    /> */}
                    <i
                      className="fi fi-rr-trash delete-icon"
                      onClick={() => handleDelete(blog._id)}
                    ></i>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      {/* Modal for displaying blog details and editing */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTitle">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
            />
            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                className="edit_description_2"
                value={editDescription_2}
                onChange={(html) => setEditDescription_2(html)} // Change this line
                modules={modules}
                formats={formats}
                placeholder="Description"
              />
            </Form.Group>
            <Form.Group controlId="editDescription">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                value={editDescription}
                onChange={(html) => setEditDescription(html)} // Change this line
                modules={modules}
                formats={formats}
                placeholder="Conten"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalfooter">
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorPosts;
