import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { format } from "timeago.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";

const AuthorPosts = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [cookies] = useCookies(["user"]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const userId = cookies.userId;
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");

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
      <h1>Your Posts</h1>
      <div className="main-container">
        <div className="blogs-container">
          {blogsList.map((blog) => (
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
                  <Button
                    onClick={() =>
                      handleEdit(
                        blog._id,
                        blog.title,
                        blog.description,
                        blog.image
                      )
                    }
                  >
                    Edit
                  </Button>
                  {/* <Button onClick={() => handleView(blog._id)}>View</Button> */}
                  <Button onClick={() => handleDelete(blog._id)}>Delete</Button>
                </div>
              </div>
            </article>
          ))}
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
            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuthorPosts;
