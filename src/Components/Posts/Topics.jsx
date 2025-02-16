import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComments, FaPlus} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import "./Topics.css";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Home from "../Home/Home.jsx";

const Topics = () => {
  // UPDATED: Initialize topics as an empty array so that fetched data replaces it
  const [topics, setTopics] = useState([]);

  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicImage, setNewTopicImage] = useState(null);
  const [newTopicCategory, setNewTopicCategory] = useState("");
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [filter, setFilter] = useState("");
  const [clicked, setClicked] = useState(false);

  // NEW: Fetch topics from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:8000/get_topics.php")
      .then((response) => response.json())
      .then((data) => {
        setTopics(data); // Update topics state with data from the database
        // Initialize likes and comments from fetched topics
        const likesData = {};
        const commentsData = {};
        data.forEach((topic) => {
          likesData[topic.id] = topic.likes || 0;
          commentsData[topic.id] = topic.comments || [];
        });
        setLikes(likesData);
        setComments(commentsData);
      })
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  const toggleAddTopic = () => {
    setIsAddTopicOpen(!isAddTopicOpen);
    setClicked(!clicked);
  };

  const handleAddTopic = () => {
    if (newTopicTitle && newTopicContent && newTopicCategory) {
      // Create the topic object (id will be assigned by the database)
      const newTopic = {
        title: newTopicTitle,
        content: newTopicContent,
        image: newTopicImage,
        category: newTopicCategory,
        likes: 0,
        comments: [],
      };

      fetch("http://localhost:8000/add_topics.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTopic),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Set the returned id to the topic
            newTopic.id = data.topicId;
            setTopics([...topics, newTopic]);
            // Also update local likes and comments state for the new topic
            setLikes((prev) => ({ ...prev, [newTopic.id]: 0 }));
            setComments((prev) => ({ ...prev, [newTopic.id]: [] }));
            //need to do something here
            const storedUser = localStorage.getItem("user");
            const parsedUser = JSON.parse(storedUser);
            if(parsedUser.createdPosts === undefined){
              parsedUser.createdPosts = [data.topicId.toString()];
              localStorage.setItem("user", JSON.stringify(parsedUser));
            }else{
              parsedUser.createdPosts.push(data.topicId.toString());// changed this to string as well if makes difference
              localStorage.setItem("user", JSON.stringify(parsedUser));
            }
          } else {
            alert("Failed to add topic: " + data.message);
          }
          setNewTopicTitle("");
          setNewTopicContent("");
          setNewTopicImage(null);
          setNewTopicCategory("");
          setIsAddTopicOpen(false);
        })
        .catch((error) => {
          console.error("Error adding topic:", error);
          alert("An error occurred. Please check console logs.");
        });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTopicImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the topic in the database when a like or comment is made
  const updateTopicInDatabase = (topicId, updatedLikes, updatedComments) => {
    const updateData = {
      topicId : topicId,
      likes: updatedLikes,
      comments: updatedComments,
    };

    // UPDATED: Correct URL with colon in the fetch request
    fetch("http://localhost:8000/update_topic.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated topic:", data);
      })
      .catch((error) => {
        console.error("Error updating topic:", error);
      });
  };

  const handleLike = (topicId) => {
    const newLikes = (likes[topicId] || 0) + 1;
    // Update the database with the new like count; preserve existing comments
    const topicComments = comments[topicId] || [];
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if(parsedUser.topicsLiked === undefined){
      updateTopicInDatabase(topicId, newLikes, topicComments);
      parsedUser.topicsLiked=[topicId];
      localStorage.setItem("user", JSON.stringify(parsedUser));
      setLikes((prev) => ({ ...prev, [topicId]: newLikes }));
    }
    else if(!parsedUser.topicsLiked.includes(topicId)){
        updateTopicInDatabase(topicId, newLikes, topicComments);
        parsedUser.topicsLiked.push(topicId);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        setLikes((prev) => ({ ...prev, [topicId]: newLikes }));
      }else{
        const reduceLikes = (likes[topicId] || 0) - 1;
        updateTopicInDatabase(topicId, reduceLikes, topicComments);
        parsedUser.topicsLiked =  parsedUser.topicsLiked.filter(id => id !== topicId);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        setLikes((prev) => ({ ...prev, [topicId]: reduceLikes }));
      }
    };
  const handleAddComment = (topicId, commentText) => {
    if (commentText) {
      const updatedComments = [...(comments[topicId] || []), commentText];
      setComments((prev) => ({ ...prev, [topicId]: updatedComments }));
      // Update the database with the new comments; preserve current likes
      const currentLikes = likes[topicId] || 0;
      updateTopicInDatabase(topicId, currentLikes, updatedComments);
    }
  };

  const handleExpandTopic = (topic) => {
    setExpandedTopic(topic);
  };


  const handleCloseExpandedTopic = () => {
    setExpandedTopic(null);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const filteredTopics = topics.filter((topic) => {
    if (!filter) return true;
    return topic.category === filter;
  });

  return (
    <div className="main-topics-container">
      <main className="topics-content">
        <div className="user-info">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
          <Avatar name="Alice" round={true} size="50" color="#0a6476" />
        </div>

        <h1 className="topics-header">POSTS</h1>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button onClick={() => handleFilterChange("")}>All</button>
          <button onClick={() => handleFilterChange("Non-Technical")}>
            Non-Technical
          </button>
          <button onClick={() => handleFilterChange("Technical")}>
            Technical
          </button>
        </div>

        <div className="topics-container">
          {filteredTopics.length === 0 ? (
            <div className="no-posts-message">No Posts Yet</div>
          ) : (
            <div className="topics-grid">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="topic-card"
                  onClick={() => handleExpandTopic(topic)}
                >
                  {topic.image && (
                    <img
                      src={topic.image}
                      alt="Topic"
                      className="topic-image"
                    />
                  )}
                  <h2>{topic.title}</h2>
                  <p>{topic.content}</p>
                  <span className={`category-label ${topic.category.toLowerCase()}`}>
                    {topic.category}
                  </span>

                  <div className="actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(topic.id);
                      }}
                    >
                      <FaThumbsUp /> {likes[topic.id] || 0} Likes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpandTopic(topic);
                      }}
                    >
                      <FaComments /> {comments[topic.id]?.length || 0} Comments
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {expandedTopic && (
          <div
            className="expanded-topic-modal"
            onClick={handleCloseExpandedTopic}
          >
            <div
              className="expanded-topic-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{expandedTopic.title}</h2>
              <span className={`category-label ${expandedTopic.category.toLowerCase()}`}>
                {expandedTopic.category}
              </span>
              <p>{expandedTopic.content}</p>
              {expandedTopic.image && (
                <img
                  src={expandedTopic.image}
                  alt="Expanded Topic"
                  className="expanded-topic-image"
                />
              )}
              <div className="expanded-comments-section">
                <h4>Comments</h4>
                {comments[expandedTopic.id]?.length > 0 ? (
                  comments[expandedTopic.id].map((comment, idx) => (
                    <p key={idx}>
                      <strong>Comment {idx + 1}:</strong> {comment}
                    </p>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
                <div className="add-comment">
                  <input
                    id="addComment"
                    name="addComment"
                    type="text"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(expandedTopic.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
              <button onClick={handleCloseExpandedTopic}>Close</button>
            </div>
          </div>
        )}

        {isAddTopicOpen && (
          <div className="add-topic-modal">
            <div className="add-topic-form">
              <input
                type="text"
                id="topicTitle"
                name="topicTitle"
                placeholder="Topic Title"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <textarea
                id="topicContent"
                name="topicContent"
                placeholder="Write something about the topic..."
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
              ></textarea>
              <input
                id="topicImage"
                name="topicImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <div className="category-buttons">
                <button
                  className={newTopicCategory === "Technical" ? "selected" : ""}
                  onClick={() => setNewTopicCategory("Technical")}
                >
                  Technical
                </button>
                <button
                  className={newTopicCategory === "Non-Technical" ? "selected" : ""}
                  onClick={() => setNewTopicCategory("Non-Technical")}
                >
                  Non-Technical
                </button>
              </div>
              <button onClick={handleAddTopic}>Add Topic</button>
            </div>
          </div>
        )}

        <button
          className={`floating-button ${clicked ? "clicked" : ""}`}
          onClick={toggleAddTopic}
        >
          <FaPlus className={clicked ? "rotated" : ""} />
        </button>
      </main>
    </div>
  );
};

export default Topics;
