import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import Avatar from "react-avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";

const projects = [
  { name: "Shop Inventory", totalTasks: 20, completedTasks: 15 },
  { name: "Delivery App", totalTasks: 25, completedTasks: 20 },
  { name: "Requirements Documentation", totalTasks: 18, completedTasks: 10 },
  { name: "Backend API", totalTasks: 22, completedTasks: 12 },
  { name: "UI Design", totalTasks: 15, completedTasks: 12 },
];

const averageCompletionRate =
  (projects.reduce((sum, project) => sum + project.completedTasks, 0) /
    projects.reduce((sum, project) => sum + project.totalTasks, 0)) *
  100;

const collaboratorColors = {
  Alice: "#2BA0B4",
  Bob: "#BEC7E7",
  Steven: "#B7DBD1",
};

const projectData = [
  {
    title: "Understanding React Hooks",
    content:
      "React hooks are a way to use state and lifecycle features in functional components.",
    category: "Technical",
    image: "https://miro.medium.com/v2/resize:fit:900/0*iTuEmxLD1IOJ5Xf1.png", // Example image URL
    id: 1,
  },
  {
    title: "JavaScript ES6 Features",
    content: "Learn about the new features introduced in ES6.",
    category: "Technical",
    image:
      "https://media.licdn.com/dms/image/v2/D4D12AQHeu6x2jIurgw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1702274710606?e=1735776000&v=beta&t=uic0nenAC1uAybIjvCjU8s_N4xNfFX8r6kFwM3pStvk", // Example image URL
    id: 2,
  },
  {
    title: "The Future of Web Development",
    content:
      "Exploring trends and technologies shaping the future of web development.",
    category: "Non-Technical",
    image:
      "https://media.licdn.com/dms/image/D4E12AQF2nlfXoZK2Yw/article-cover_image-shrink_600_2000/0/1675704281846?e=2147483647&v=beta&t=Rs9ejfu9oorJGUiudx8OkCEx0JKdFPsa_WIx0qmtS4Y", // Example image URL
    id: 3,
  },
];

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [refresh, setRefresh] = useState([]);
  const [taskList, setTasks] = useState([
    { id: 1, task: "Complete project documentation", completed: false },
    { id: 2, task: "Prepare for presentation", completed: false },
    { id: 3, task: "Fix bugs in the delivery app", completed: false },
  ]);

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      taskList.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleExpandTopic = (topic) => {
    setExpandedTopic(topic);
  };

  const handleCloseExpandedTopic = () => {
    setExpandedTopic(null);
  };

  const [pendingTasks, setPendingTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user ? user.id : null;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userID = user ? user.id : null;

    if (!userID) return;

    fetch(`http://localhost:8000/Home/get_pending_tasks.php?userID=${userID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Format the fetched data into the state structure
          const formattedTasks = data.tasks.map((task) => ({
            id: task.TaskID,
            task: task.title,
            completed: false, // Since it's pending, mark it as not completed
          }));
          setTasks(formattedTasks); // ✅ Corrected this line
        } else {
          console.error("Error fetching pending tasks:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching pending tasks:", error));
  }, []);

  return (
    <div className="home-container">
      <main className="main-content">
        {/* Header */}
        <div className="top-bar">
          <span className="header-text">Good Morning,👋</span>
          <div className="main-user-info"></div>
        </div>

        {/* Dashboard Content */}
        <div className="content">
          <div className="grid-container">
            {/* Projects Overview Section */}
            <div className="tasks-section white-section">
              <h3>Projects Overview</h3>
              <div className="overview-charts">
                {/* Pie Chart for Average Completion Rate */}
                <div className="average-completion-pie">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: "completed",
                            value: averageCompletionRate,
                            color: "#2BA0B4",
                          },
                          {
                            id: "remaining",
                            value: 100 - averageCompletionRate,
                            color: "#ddd",
                          },
                        ],
                        innerRadius: 73,
                        outerRadius: 100,
                        paddingAngle: 3,
                        colors: ["#2BA0B4", "#ddd"],
                      },
                    ]}
                    width={300}
                    height={300}
                    slotProps={{
                      labels: {
                        render: ({ datum }) => {
                          if (datum.id === "remaining") return "";
                          return `${averageCompletionRate.toFixed(
                            0
                          )}% Completed`;
                        },
                        style: {
                          fontSize: 12,
                          fill: "#333",
                          textAnchor: "middle",
                          dominantBaseline: "central",
                        },
                      },
                    }}
                  />
                </div>

                {/* Bar Chart for Project-Specific Task Counts */}
                <div className="projects-bar-chart">
                  <BarChart
                    series={[
                      {
                        data: projects.map((project) => project.totalTasks),
                        label: "Total Tasks",
                        color: "#BEC7E7",
                      },
                      {
                        data: projects.map((project) => project.completedTasks),
                        label: "Completed Tasks",
                        color: "#2BA0B4",
                      },
                    ]}
                    categories={projects.map((project) => project.name)}
                    width={500}
                    height={300}
                  />
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="calendar white-section">
              <h3>Calendar</h3>
              <Calendar value={date} onChange={setDate} />
            </div>

            {/* To-do List Section */}
            <div className="todo-list white-section">
              <h3>To-do List</h3>
              <ul>
                {taskList.length > 0 ? (
                  taskList.map((task) => (
                    <li key={task.id}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                      <span
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.task}
                      </span>
                    </li>
                  ))
                ) : (
                  <p>No pending tasks available.</p>
                )}
              </ul>
            </div>
            {/* Post Section */}
            <div className="posts white-section">
              <h3>Recent Posts</h3>
              <div className="post-grid">
                {projectData.map((item, index) => (
                  <div
                    key={item.id}
                    className="topic-card"
                    onClick={() => handleExpandTopic(item)}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Topic"
                        className="topic-image"
                      />
                    )}
                    <h2>{item.title}</h2>
                    <p>{item.content}</p>
                    <span
                      className={`category-label ${item.category.toLowerCase()}`}
                    >
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              <span
                className={`category-label ${expandedTopic.category.toLowerCase()}`}
              >
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

              <button onClick={handleCloseExpandedTopic}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
