import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { format } from "timeago.js";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HashLoader from "react-spinners/HashLoader";
import { set } from "mongoose";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["user"]);
  const [username, setUsername] = useState("");
  const userId = cookies.userId;
  const [blogsList, setBlogsList] = useState([]);
  const [usernames, setUsernames] = useState({});
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API + `/get-username/${userId}`)
      .then((res) => {
        // setLoading(true);
        setUsername(res.data.username);
      });

    axios.get(process.env.REACT_APP_API + `/fetch-blogs`).then((response) => {
      setBlogsList(response.data);
      setLoading(false);
      // Fetch usernames for each blog author
      response.data.forEach((blog) => {
        axios
          .get(process.env.REACT_APP_API + `/get-username/${blog.userId}`)
          .then((res) => {
            // setLoading(false);
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
    if (id) {
      console.log("Navigating to blog with ID:", id);
      navigate(`/dashboard/${id}`, { state: { id } });
    } else {
      console.error("Invalid blog ID:", id);
    }
  };

  const shortenDescription = (description_2) =>
    description_2.length > 200
      ? description_2.substr(0, 200) + "..."
      : description_2;

  const shortenTitle = (title) =>
    title.length > 23 ? title.substr(0, 23) + "..." : title;

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
            {blogsList.map(
              (blog) =>
                blog._id && (
                  <article
                    key={blog._id}
                    className="blog"
                    style={{ order: blog._createdAt }}
                  >
                    <div className="blog-header">
                      <img
                        className="blog-img"
                        src={blog.image}
                        alt={blog.title}
                      />
                    </div>
                    <div className="blog-info">
                      <h3 className="truncate">{blog.title}</h3>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: shortenDescription(blog.description_2),
                        }}
                      ></p>
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
                        view
                      </Button>
                    </div>
                  </article>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
