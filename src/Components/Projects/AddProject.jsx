import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Projects.css";
// Retrieve userID from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const userID = user ? user.id : null; // Assuming user.id holds the userID




const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamLeader: "",
    teamMembers: [],
    projectPhases: [],
    tasks: [], // Ensuring tasks array exists
  });

  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({
    description: "",
    assignedTo: "",
    category: "Technical",
    dueDate: "",
  });
  const [phase, setPhase] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Fetch employees when the component mounts
  useEffect(() => {
    fetch("http://localhost:8000/get_employees.php")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.employees || []); // Ensure employees is an array
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setEmployees([]); // Set default empty array on error
      });
  }, []);

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((id) => id !== value),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handlePhaseChange = (e) => {
    const { name, value } = e.target;
    setPhase((prevPhase) => ({
      ...prevPhase,
      [name]: value,
    }));
  };

  const addPhase = () => {
    if (!phase.name || !phase.startDate || !phase.endDate) {
      alert("Please fill in all phase details.");
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      projectPhases: [
        ...prevData.projectPhases,
        { ...phase, status: "Not Started" },
      ],
    }));
  
    // Reset fields after adding phase
    setPhase({
      name: "",
      startDate: "",
      endDate: "",
    });
  };
  
  const addTask = () => {
    if (!task.description || !task.assignedTo || !task.dueDate) {
      alert("Please fill in all task details.");
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      tasks: [...prevData.tasks, { ...task, status: "Pending" }], // Default status
    }));
  
    // Reset task input fields
    setTask({
      description: "",
      assignedTo: "",
      category: "Technical",
      dueDate: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form behavior
    console.log("Submitting formData:", formData);
  
    // Ensure at least one phase or task exists
    if (formData.projectPhases.length === 0 && formData.tasks.length === 0) {
      alert("You must add at least one phase or task before submitting.");
      return;
    }
  
    // Create assignments array based on the teamLeader and teamMembers
    const assignments = [
      { project_id: 0, employee_id: formData.teamLeader, is_team_leader: true }, // Add team leader assignment
      ...formData.teamMembers.map((memberId) => ({
        project_id: 0, // This will be set to the actual project ID after insertion
        employee_id: memberId,
        is_team_leader: false,
      })),
    ];
  
    // Add the assignments to formData for submission
    const projectData = {
      ...formData,
      assignments,
      userID // Add the assignments data
    };
  
    console.log("Submitting project data:", projectData);
  
    // Send project data to the PHP backend
    fetch("http://localhost:8000/add_project.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData), // Make sure projectData includes all required fields
    })
      .then((response) => response.text()) // First, get the raw text response
      .then((text) => {
        console.log("Raw Response:", text);
        try {
          return JSON.parse(text); // Attempt to parse JSON
        } catch (error) {
          throw new Error("Invalid JSON response from server: " + text);
        }
      })
      .then((data) => {
        if (data.success) {
          alert("Project added successfully!");
          navigate("/projects");
        } else {
          alert(`Failed to add project: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error adding project:", error);
        alert("An error occurred. Please check console logs.");
      });
  };
  

  return (
    <div className="project-page">
      <h1 className="projects-header">Add New Project</h1>
      <form onSubmit={handleSubmit} className="add-project-form">
        <div className="project-info-box">
          <label>
            Project Title:
            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
          </label>
          <label>
            Project Description:
            <textarea name="description" value={formData.description} onChange={handleFormChange} required />
          </label>
        </div>

        <div className="team-info-box">
          <label>
            Team Leader:
            <select name="teamLeader" value={formData.teamLeader} onChange={handleFormChange} required>
              <option value="">Select Team Leader</option>
              {employees?.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <label>Team Members:</label>
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '0.5rem',
                boxSizing: 'border-box',
                marginBottom: '1rem',
              }}
            >
              {employees.map((employee) => (
                <div key={employee.id}>
                  <input
                    type="checkbox"
                    id={`team-member-${employee.id}`}
                    name="teamMembers"
                    value={employee.id}
                    checked={formData.teamMembers.includes(employee.id)}
                    onChange={handleFormChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor={`team-member-${employee.id}`}>{employee.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-box">
          <h3>Project Tasks</h3>
          <label>
            Task Description:{" "}
            <input
              type="text"
              name="description"
              value={task.description}
              onChange={handleTaskChange}
            />
          </label>
          <br />
          <label>
            Assign To:{" "}
            <select
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleTaskChange}
            >
              <option value="">Select Member</option>
              {formData.teamMembers?.map((memberId) => {
                const employee = employees.find((emp) => emp.id === memberId);
                return employee ? (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ) : null;
              })}
            </select>
          </label>
          <br />
          <label>
            Category:{" "}
            <select
              name="category"
              value={task.category}
              onChange={handleTaskChange}
            >
              <option value="Technical">Technical</option>
              <option value="Non-Technical">Non-Technical</option>
            </select>
          </label>
          <br />
          <label>
            Due Date:{" "}
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleTaskChange}
            />
          </label>
          <br />
          <button type="button" onClick={addTask}>
            Add Task
          </button>

          <h4>Added Tasks:</h4>
          <ul>
            {formData.tasks.map((t, index) => (
              <li key={index}>
                <strong>{t.description}</strong> – Assigned to:{" "}
                {employees.find((emp) => emp.id === t.assignedTo)?.name} – Category:{" "}
                {t.category}{" "}
                {t.dueDate && `– Due: ${t.dueDate}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="phases-box">
          <h3>Project Phases</h3>
          <label>
            Phase Name:
            <input
              type="text"
              name="name"
              value={phase.name}
              onChange={handlePhaseChange}
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={phase.startDate}
              onChange={handlePhaseChange}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={phase.endDate}
              onChange={handlePhaseChange}
            />
          </label>
          <button type="button" onClick={addPhase}>
            Add Phase
          </button>
        </div>

        <div className="phases-completed-box">
          <h3>Added Phases:</h3>
          <ul>
            {formData.projectPhases.map((phase, index) => (
              <li key={index}>
                {phase.name} (Start: {phase.startDate}, End: {phase.endDate}, Status: {phase.status})
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Save Project</button>
      </form>
    </div>
  );
};

export default AddProject;
