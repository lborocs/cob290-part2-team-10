import React, { useState, useEffect } from "react";
import "./Projects.css"; // Keep the same CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import Sidebar from "../Sidebar/Sidebar.jsx"; // Import Sidebar component
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
//const [userRole, setUserRole] = useState(""); // Store the user role

const Projects = () => {
  const navigate = useNavigate();  // useNavigate hook inside the component
  const [projects, setProjects] = useState([]);  // Fetch projects state
  const [activeProject, setActiveProject] = useState(null);  // Active project state
  const [loading, setLoading] = useState(true);  // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
  const [employees, setEmployees] = useState([]);  // Employees state
  const [formData, setFormData] = useState({ // Form data state for the Add Project form
    title: "",
    description: "",
    teamLeader: "",
    teamMembers: [],
    tasks: [],
    milestones: [] 
  });
  const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  console.log("User ID:", user.id);
  console.log("User Role:", user.role);
} else {
  console.log("No user found in localStorage.");
}


  // Handle Add Project click
  const handleAddProjectClick = () => {
    navigate('/add-project');  // Navigate to Add Project page
  };

  // Fetch projects and employees
  useEffect(() => {
    fetch("http://localhost:8000/get_projects.php")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.projects);
        setActiveProject(data.projects.length > 0 ? data.projects[0] : null);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching projects:", error));

    // Fetch employees for the dropdown
    fetch("http://localhost:8000/get_employees.php")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.employees);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Handle selecting a project
  const handleProjectSelect = (project) => {
    setActiveProject(project);
  };

  // Handle Modal Toggle
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle adding team members
  const handleTeamMemberChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: [...prevData.teamMembers, value]
    }));
  };

  // Handle adding tasks
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tasks: [...prevData.tasks, { [name]: value }]
    }));
  };

  // Handle adding milestones
  const handleMilestoneChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      milestones: [...prevData.milestones, { [name]: value }]
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/add_project.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Project added successfully");
          setProjects([...projects, formData]); // Update state with new project
          setIsModalOpen(false);
        } else {
          alert("Failed to add project");
        }
      })
      .catch((error) => console.error("Error adding project:", error));
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-page">
      <h1 className="projects-header">PROJECTS</h1>
      <div className="projects-page-wrapper">
        <div className="projects-sidebar">
          <div className="user-info">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <Avatar name="Alice" round={true} size="50" color="#0a6476" />
          </div>
          <h4 className="projects-title-header">Project Titles</h4>
          {projects.map((project) => (
            <button
              key={project.id}
              className={`project-title-button ${activeProject?.id === project.id ? "active" : ""}`}
              onClick={() => handleProjectSelect(project)}
            >
              {project.title}
            </button>
          ))}
          <div>
    {user?.role === "manager" && (
      <button onClick={handleAddProjectClick}>+ Add Project</button>
    )}
  </div>
        </div>

        <div className="project-info-content">
          {activeProject ? (
            <>
              <div className="project-info-box">
                <h2>{activeProject.title}</h2>
                <p>{activeProject.description}</p>
              </div>

              <div className="team-members-box">
                <h3>Project Team</h3>
                <div className="team-leader-section">
                  <h4>Team Leader</h4>
                  {activeProject.teamLeader ? (
                    <div className="team-leader">
                      <div className={`team-member-avatar avatar-color-1`}>
                        {activeProject.teamLeader.name.charAt(0)}
                      </div>
                      <strong>{activeProject.teamLeader.name}</strong> - <span>Team Leader</span>
                    </div>
                  ) : (
                    <p>No team leader assigned.</p>
                  )}
                </div>
                <div className="team-members-section">
                  <h4>Team Members</h4>
                  <ul className="team-list">
                    {activeProject.teamMembers.map((member, index) => (
                      <li key={index} className="team-member">
                        <div className={`team-member-avatar avatar-color-${index % 4 + 1}`}>
                          {member.name.charAt(0)}
                        </div>
                        <strong>{member.name}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tasks-box">
                <h3>Tasks Outline</h3>
                <ul>
                  {activeProject.tasks.map((task, index) => (
                    <li key={index}>{task.description} (Status: {task.status})</li>
                  ))}
                </ul>
              </div>

              <div className="tasks-completed-box">
                <h3>Project Timeline</h3>
                <div className="hori-timeline" dir="ltr">
                  <ul className="list-inline events">
                    {activeProject.milestones.map((milestone, index) => (
                      <li key={index} className="list-inline-item event-list">
                        <div className="px-4">
                          <div
                            className={`event-date bg-soft-${milestone.status === "Completed" ? "success text-success" : "warning text-warning"}`}
                          >
                            {new Date(milestone.start_date).toLocaleDateString()}
                          </div>
                          <h5 className="font-size-16">{milestone.milestone}</h5>
                          <p className="text-muted">
                            {`Starts: ${new Date(milestone.start_date).toLocaleDateString()} | Ends: ${new Date(milestone.end_date).toLocaleDateString()}`}
                          </p>
                          <p>Status: {milestone.status}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p>No project selected</p>
          )}
        </div>
      </div>
      <div>
         </div>
    </div>
  );
};

export default Projects;
