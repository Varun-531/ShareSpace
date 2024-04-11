import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const [username, setUsername] = useState("");
  const userId = cookies.userId;
  const [blogsList, setBlogsList] = useState([]);
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/get-username/${userId}`).then((res) => {
      setUsername(res.data.username);
    });

    axios.get(`http://localhost:3001/fetch-blogs`).then((response) => {
      setBlogsList(response.data);

      // Fetch usernames for each blog author
      response.data.forEach((blog) => {
        axios
          .get(`http://localhost:3001/get-username/${blog.userId}`)
          .then((res) => {
            setUsernames((prevUsernames) => ({
              ...prevUsernames,
              [blog.userId]: res.data.username,
            }));
          });
      });
    });
  }, [userId]);
  // const handleCreateBlog = () => {
  //   navigate("/create-post");
  // };
  // const handleAuthorPosts = () => {
  //   navigate("/author-post");
  // };

  const handleClicker = (id) => {
    navigate(`/dashboard/${id}`, { state: { id } });
  };
  const shortenDescription = (description) =>
    description.length > 200 ? description.substr(0, 200) + "..." : description;

  const shortenTitle = (title) =>
    title.length > 23 ? title.substr(0, 23) + "..." : title;

  return (
    <div className="main">
      {/* <h1>Welcome {username}</h1> */}
      {/* <Button className="dash-button" onClick={handleCreateBlog}>
        Create Post
      </Button>
      <br />
      <Button className="dash-button" onClick={handleAuthorPosts}>
        Your Posts
      </Button> */}

      <div className="main-container">
        <div className="blogs-container">
          {blogsList.map((blog) => (
            <article key={blog._id} className="blog">
              <div className="blog-header">
                <img className="blog-img" src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-info">
                <h3>{shortenTitle(blog.title)}</h3>
                <p>{shortenDescription(blog.description)}</p>
              </div>
              <div className="blog-footer">
                <div className="footer-one">
                  <p className="p-author">
                    <span className="span-author">Author : </span>{" "}
                    {usernames[blog.userId]}
                  </p>
                  <p className="p-time">{format(blog.createdAt)}</p>
                </div>
                <Button onClick={() => handleClicker(blog._id)}>
                  Read More
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
