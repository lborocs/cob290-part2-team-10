import React, { useState, useEffect } from "react";
import Avatar from "react-avatar"; // Import Avatar for the profile icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Bar, Pie } from "react-chartjs-2"; // Correctly import both Bar and Pie
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js"; // Import necessary elements for charts
import "./Analytics.css"; // Ensure that you have the necessary CSS for sidebar styling
import Sidebar from "../Sidebar/Sidebar.jsx";
// Register the required elements for both Bar and Pie charts
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Analytics = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State to manage sidebar visibility

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };

  //Database connection
  // const [topMostTasks, setTopMostTasks] = useState([]);
  // const [topLeastTasks, setTopLeastTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [rowsToShow, setRowsToShow] = useState(10); // Default to 10 rows
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [lowestRatedProject, setLowestRatedProject] = useState(null);
  const [projects, setProjects] = useState([]); // Store all projects
  const [selectedProject, setSelectedProject] = useState(""); // Selected Project ID
  const [projectDetails, setProjectDetails] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);

  //Use effect for the backlog function
  useEffect(() => {
    fetch(`http://localhost:8000/get_analytics.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.tasks)) {
          throw new Error("Invalid data structure received from API");
        }

        // Extract Overdue Tasks and Include Employee Name
        const overdue = data.tasks.flatMap((employee) =>
          employee.Tasks.filter(
            (task) => new Date(task.DueDate) < new Date()
          ).map((task) => ({
            ...task, // Keep Task Data
            EmployeeName: employee.Name, // Attach Employee Name
          }))
        );

        setOverdueTasks(overdue);
        setTaskData(data.tasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Fetch all project names & IDs
  useEffect(() => {
    fetch(`http://localhost:8000/allProjects.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.projects) {
          setProjects(data.projects);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  // Fetch project details when a project is selected
  useEffect(() => {
    if (selectedProject) {
      // Only fetch if a project is selected
      console.log(`Fetching project details for ID: ${selectedProject}`);

      fetch(
        `http://localhost:8000/allTasks.php?project_id=${encodeURIComponent(
          selectedProject
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data); // Debug response
          if (data.project_details) {
            setProjectDetails(data.project_details);
          } else {
            console.error("No project details found.");
            setProjectDetails(null); // Clear details if not found
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    } else {
      setProjectDetails(null); // Clear details if no project is selected
    }
  }, [selectedProject]);

  //Use effect for rating analysis
  useEffect(() => {
    fetch(`http://localhost:8000/ratings.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.lowest_rated_project) {
          setLowestRatedProject(data.lowest_rated_project);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  //Use effect for the Employee Task overview
  useEffect(() => {
    fetch(`http://localhost:8000/get_analytics.php`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.tasks)) {
          throw new Error("Invalid data structure received from API");
        }
        setTaskData(data.tasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="top-bar">
        <span className="header-text">Manager Dashboard</span>
        <div className="user-avatar">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
          <Avatar
            name="Alice"
            round={true}
            size="50"
            color="#0a6476"
            textColor="#333"
          />
        </div>
      </div>
      <main className="analytics-content">
        {/* Backlog Card */}
        <div className="backlog-card">
          <h2 className="backlog-title">
            Backlog{" "}
            <span style={{ fontSize: "16px", color: "#757575" }}>
              ({overdueTasks.length})
            </span>
          </h2>
          <ul className="backlog-task-list">
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task, index) => (
                <li key={index} className="backlog-task-item">
                  <strong>{task.Description}</strong> - Assigned to:{" "}
                  {task.EmployeeName} (Due: {task.DueDate})
                </li>
              ))
            ) : (
              <p>No overdue tasks!</p>
            )}
          </ul>
        </div>

        <div className="emp-analysis-charts-card">
          <h3>Employee Task Overview</h3>

          {/* Filter for Number of Rows */}
          <div className="filter-container">
            <label>Show: </label>
            <select
              value={rowsToShow}
              onChange={(e) => setRowsToShow(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value={taskData.length}>All</option>{" "}
              {/* Dynamically show all */}
            </select>
          </div>

          {/* Employee Task Table */}
          <table className="task-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Total Tasks</th>
                <th>Pending</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {taskData.slice(0, rowsToShow).map((employee, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="clickable-row"
                    onClick={() =>
                      setExpandedEmployee(
                        expandedEmployee === employee.Name
                          ? null
                          : employee.Name
                      )
                    }
                  >
                    <td>{employee.Name}</td>
                    <td>{employee.TotalTasks}</td>
                    <td>{employee.Pending}</td>
                    <td>{employee.Completed}</td>
                  </tr>

                  {/* Show Task Details When Employee is Expanded */}
                  {expandedEmployee === employee.Name && (
                    <tr className="task-details-row">
                      <td colSpan="5">
                        <table className="task-details-table">
                          <thead>
                            <tr>
                              <th>Task ID</th>
                              <th>Description</th>
                              <th>Status</th>
                              <th>Due Date</th>
                              <th>Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {employee.Tasks.map((task, taskIndex) => (
                              <tr key={taskIndex}>
                                <td>{task.TaskID}</td>
                                <td>{task.Description}</td>
                                <td>{task.Status}</td>
                                <td>{task.DueDate}</td>
                                <td>{task.Category}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          className="close-details-btn"
                          onClick={() => setExpandedEmployee(null)}
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Task Performance Report Card */}
        <div className="task-performance-report-card">
          <h3>Project In Training</h3>

          {lowestRatedProject ? (
            <div className="lowest-rated-project">
              <p>
                <strong>Lowest Rated Project</strong>:{" "}
                {lowestRatedProject.ProjectTitle}
                <br />
                <strong>Project Leader</strong>:{" "}
                {lowestRatedProject.TeamLeaderName}
                <br />
                <strong>Average Project Rating</strong>:{" "}
                <span style={{ color: "red" }}>
                  {lowestRatedProject.AvgRating.toFixed(2)}
                </span>
              </p>

              <h3>Tasks In Training</h3>
              <table className="training-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Rating</th>
                    <th>Assigned Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {lowestRatedProject.LowestRatedTasks.map((task, index) => (
                    <tr key={index}>
                      <td>{task.TaskName}</td>
                      <td style={{ color: "red" }}>{task.Rating}</td>
                      <td>{task.EmployeeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading project ratings...</p>
          )}
        </div>
        {/* Task Timeline Chart Card */}
        <div className="task-timeline-card">
          {/* Project Filter Section */}
          <div className="project-filter-container">
            <h3>Detailed Project Overview</h3>
            <select
              className="projectOverviewSelect"
              onChange={(e) => setSelectedProject(e.target.value)}
              value={selectedProject}
            >
              <option value="">-- Select Project --</option>
              {projects.map((project) => (
                <option key={project.ProjectID} value={project.ProjectID}>
                  {project.ProjectTitle} (ID: {project.ProjectID})
                </option>
              ))}
            </select>
          </div>

          {/* Grid Layout for Project Info and Timeline */}
          {projectDetails && (
            <div className="project-overview">
              {/* Left: Project Details */}
              <div className="project-details">
                <h2>Project Details</h2>
                <p>
                  <strong>Project Title:</strong> {projectDetails.ProjectTitle}
                </p>
                <p>
                  <strong>Team Leader:</strong> {projectDetails.TeamLeader}
                </p>
                <p>
                  <strong>Team Members:</strong>{" "}
                  {projectDetails.TeamMembers.join(", ")}
                </p>
                <p>
                  <strong>Task Completion:</strong>{" "}
                  {projectDetails.CompletedTasks} / {projectDetails.TotalTasks}
                </p>
              </div>

              {/* Right: Project Timeline */}
              <div className="project-timeline">
                <h2>Project Timeline</h2>
                <div className="timeline">
                  {projectDetails.Timeline.map((milestone, index) => (
                    <div
                      key={index}
                      className={`timeline-item ${milestone.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <h4>{milestone.milestone}</h4>
                      <p>
                        {milestone.start_date} - {milestone.end_date}
                      </p>
                      <p>
                        <strong>Status:</strong> {milestone.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
