import "./ToDo.css"; // Custom CSS
import Avatar from "react-avatar";
import React, { useState, useEffect } from "react";
import { faBell, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ToDoList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user ? user.id : null;
  const [tasks, setTasks] = useState({
    pending: [],
    complete: [],
    ongoing: [],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    Status: "pending",
    DueDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    if (!userID) return;
    fetch(`http://localhost:8000/ToDo/get_todo.php?userID=${userID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setTasks(data.tasks);
        } else {
          console.error("Error fetching tasks:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [userID]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const saveTask = () => {
    if (!newTask.title.trim()) {
      alert("Task title cannot be empty");
      return;
    }

    const apiUrl = isEditing
      ? "http://localhost:8000/ToDo/edit_todo.php"
      : "http://localhost:8000/ToDo/add_todo.php";

    const requestBody = {
      title: newTask.title,
      description: newTask.description,
      Status: newTask.Status,
      DueDate: newTask.DueDate,
      EmployeeID: userID,
      ProjectID: 1, // Replace with actual ProjectID
      ManagerID: 1, // Replace with actual ManagerID
      Rating: 0, // Default or required value
      Category: "General", // Default category
    };

    if (isEditing) {
      requestBody.TaskID = editingTaskId;
    }

    fetch(apiUrl, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          fetch(`http://localhost:8000/ToDo/get_todo.php?userID=${userID}`)
            .then((res) => res.json())
            .then((updatedData) => {
              setTasks(updatedData.tasks);
              resetForm();
            })
            .catch((err) =>
              console.error("Error fetching updated tasks:", err)
            );
        } else {
          console.error("Failed to update task:", data.message);
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const deleteTask = (taskID, column) => {
    fetch("http://localhost:8000/ToDo/delete_todo.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TaskID: taskID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setTasks((prevTasks) => ({
            ...prevTasks,
            [column]: prevTasks[column].filter(
              (task) => task.TaskID !== taskID
            ),
          }));
        } else {
          console.error("Failed to delete task:", data.message);
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const openEditForm = (task) => {
    setNewTask({
      title: task.title,
      description: task.Description,
      Status: task.Status,
      DueDate: task.DueDate,
    });
    setIsFormOpen(true);
    setIsEditing(true);
    setEditingTaskId(task.TaskID);
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      description: "",
      Status: "pending",
      DueDate: "",
    });
  };

  return (
    <div className="full-page">
      <div className="page-wrapper">
        <h1 className="header">My TO-DO List</h1>
        <button className="add-task-button" onClick={() => setIsFormOpen(true)}>
          Add Task
        </button>
        <div className="box-wrapper">
          {Object.keys(tasks).map((status) => (
            <div key={status} className="box">
              <h2>{status.toUpperCase()}</h2>
              {tasks[status].map((task) => (
                <div key={task.TaskID} className="task">
                  <span>{task.title}</span>
                  <button
                    className="tasks-edit-button"
                    onClick={() => openEditForm(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="tasks-delete-button"
                    onClick={() => deleteTask(task.TaskID, status)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        {isFormOpen && (
          <div className="form-overlay" onClick={resetForm}>
            <div className="form-wrapper" onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? "Edit Task" : "Add New Task"}</h2>
              <input
                className="form-input"
                name="title"
                placeholder="Task Title"
                value={newTask.title}
                onChange={handleFormChange}
              />
              <input
                className="form-input"
                name="description"
                placeholder="Task Description"
                value={newTask.description}
                onChange={handleFormChange}
              />
              <input
                className="form-input"
                name="DueDate"
                type="date"
                value={newTask.DueDate}
                onChange={handleFormChange}
              />
              <div>
                <button className="form-button" onClick={saveTask}>
                  {isEditing ? "Update" : "Save"}
                </button>
                <button className="form-button" onClick={resetForm}>
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
