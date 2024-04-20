import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { format } from "timeago.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AuthorPosts = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [cookies] = useCookies(["user"]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const userId = cookies.userId;
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");

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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/fetch-blogs/${userId}`)
      .then((response) => {
        console.log(response.data);
        setBlogsList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId, blogsList]);

  const handleEdit = (id, title, description, image) => {
    setSelectedBlog({ _id: id, title, description, image });
    setEditTitle(title);
    setEditDescription(description);
    setEditImage(image);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/delete-blog/${id}`)
      .then((response) => {
        console.log(response.data);
        // Filter out the deleted blog from the blogsList
        const updatedBlogsList = blogsList.filter((blog) => blog._id !== id);
        setBlogsList(updatedBlogsList);
        toast.success("Blog deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveEdit = () => {
    axios
      .post(`http://localhost:3001/update-blog/${selectedBlog._id}`, {
        title: editTitle,
        description: editDescription,
        image: editImage,
      })
      .then((response) => {
        console.log(response.data);
        // Update the edited blog in the UI
        const updatedBlogsList = blogsList.map((blog) =>
          blog._id === selectedBlog._id ? response.data : blog
        );
        setBlogsList(updatedBlogsList);
        setShowModal(false);
        toast.success("Blog updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const shortenDescription = (description) =>
    description.length > 200 ? description.substr(0, 200) + "..." : description;

  const shortenTitle = (title) =>
    title.length > 20 ? title.substr(0, 20) + "..." : title;

  return (
    <div>
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
                  <p>{shortenDescription(blog.description)}</p>
                </div>
                <div className="blog-footer">
                  <p className="p-time">
                    <span className="span-author">Created : </span>
                    {format(blog.createdAt)}
                  </p>
                  <div className="blog-buttons">
                    <CiEdit
                      className="edit-icon"
                      onClick={() =>
                        handleEdit(
                          blog._id,
                          blog.title,
                          blog.description,
                          blog.image
                        )
                      }
                    />

                    <MdDeleteForever
                      className="delete-icon"
                      onClick={() => handleDelete(blog._id)}
                    />
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
              {/* <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              /> */}
              <ReactQuill
                value={editDescription}
                onChange={setEditDescription}
                modules={modules}
                formats={formats}
                placeholder="Description"
              />
            </Form.Group>
            <Form.Group controlId="editImage"></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorPosts;
