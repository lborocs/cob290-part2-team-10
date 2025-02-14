import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import Avatar from "react-avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";
import { TitleTwoTone } from "@mui/icons-material";

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


const Home = () => {



const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  console.log("User ID:", user.id);
  console.log("User Role:", user.name);
} else {
  console.log("No user found in localStorage.");
}
const employeename=user.name;

///####///


  
  //
  const [post1data, newData] = useState(null);
  let url="http://localhost:8000/testtopics.php"
  useEffect(() => {
      fetch(url )
    .then((response) => response.json())
    .then(newData)
  //  .then(json => {   console.log('parsed json', json)}
    .catch(error => console.error('Error fetching data:', error));
},[]);
const [listdata, newData1] = useState(null);
let url2="http://localhost:8000/testlist.php.php"
useEffect(() => {
  //need to acutually send the logged in user's id...how?? id love it if another page when _Logging_ in could send a cookie or soemthing
    fetch(url2,{headers:{accept:"application/json" }} )
  .then((response) => response.json())
  .then(newData1)
  .catch(error => console.error('Error fetching data2:', error));
},[]);
  //###########
  const [date, setDate] = useState(new Date());
console.log("pizza");
  console.log(post1data);
  console.log(newData);
console.log("a");
  //######
const projectData = [{  }];
var n=0;
try{
while (post1data.length>0 &&n<3){

  projectData.push(
    {title: post1data[n]['title'],
      content: post1data[n]['content'],
category: post1data[n]['category'],
image:post1data[n]['image'],
id: post1data[n]['id'],
    }
   
  ); 
  n++;
  
};}
catch(exception){}
  //tasks
 //listdata is the list data to be iterated over
// Hardcoded initial tasks


const [tasks, setTasks1] = useState({
  todo: [
      ],
    inProgress:[], done:[]

});
var i=0;
try{
for (  i=0;i<listdata.length;i++){
  if(listdata[i]['currentProgress']=="todo"){
    [tasks,setTasks1].todo.push(
      
      {
        title: listdata[i]['title'],
        description: listdata[i]['description'],
        currentProgress: "todo",
        deadline: listdata[i]['deadline'],
      },
  
  )};

  if (listdata[i]['currentProgress']=="InProgress"){
        [tasks,setTasks1].inProgress.push(
        {
          title: listdata['title'],
          description: listdata['description'],
          currentProgress: "inProgress",
          deadline: listdata['deadline'],
        },)};

  if(newData1[i]['currentProgress']=="done"){
        [tasks,setTasks1].done.push(
        {
        title: listdata['title'],
          description: listdata['description'],
          currentProgress: "done",
          deadline: listdata['deadline'],
        })

};
};//#for loop
}catch(exception){}


  
const [isFormOpen, setIsFormOpen] = useState(false);
const [newTask, setNewTask] = useState({
  title: "",
  description: "",
  currentProgress: "todo",
  deadline: "",
});

// New state to track editing task
const [isEditing, setIsEditing] = useState(false);
const [editingTaskId, setEditingTaskId] = useState(null);
const [editingTaskColumn, setEditingTaskColumn] = useState(null); // Track which column the task belongs to

// Function to handle form input changes
const handleFormChange = (e) => {
  const { name, value } = e.target;
  setNewTask({ ...newTask, [name]: value });
};

// Function to add or update a task
const saveTask = () => {
  const updatedTasks = { ...tasks };

  // If editing, we need to find and remove the task from its current column
  if (isEditing) {
    const taskIndex = updatedTasks[editingTaskColumn].findIndex(
      (task) => task.title === editingTaskId
    );

    // Remove the task from the old column
    const taskToUpdate = updatedTasks[editingTaskColumn][taskIndex];

    // Check if the current progress has changed
    if (taskToUpdate.currentProgress !== newTask.currentProgress) {
      updatedTasks[editingTaskColumn].splice(taskIndex, 1); // Remove from old column
      updatedTasks[newTask.currentProgress].push({ ...newTask }); // Add to new column
    } else {
      // If no change in progress, just update the existing task
      updatedTasks[editingTaskColumn][taskIndex] = newTask;
    }
  } else {
    // Add new task
    updatedTasks[newTask.currentProgress].push(newTask);
  }

  setTasks1(updatedTasks);
  resetForm();
};

// Function to reset the form
const resetForm = () => {
  setIsFormOpen(false);
  setNewTask({
    title: "",
    description: "",
    currentProgress: "todo",
    deadline: "",
  });
  setIsEditing(false);
  setEditingTaskId(null);
  setEditingTaskColumn(null); // Reset the editing task column
};

// Function to open the form for editing
const openEditForm = (task, column) => {
  setNewTask(task);
  setIsFormOpen(true);
  setIsEditing(true);
  setEditingTaskId(task.title);
  setEditingTaskColumn(column); // Set the column of the task being edited
};

// Deadline check and notification
 

// Function to delete a task
const deleteTask = (taskTitle, column) => {
  const updatedTasks = { ...tasks };
  updatedTasks[column] = updatedTasks[column].filter(
    (task) => task.title !== taskTitle
  );
  setTasks1(updatedTasks);
};



//end of that


  return (
    <div className="home-container">
      <main className="main-content">
        {/* Header */}
        <div className="top-bar">
          <span className="header-text">Good Morning, {"employeename"} 👋</span>
          <div className="main-user-info">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <div className="user-avatar">
              <Avatar
                name={"employeename"}
                round={true}
                size="50"
                color="#0a6476"
                textColor="#333"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="content">
          <div className="grid-container">
            {/* Projects Overview Section */}
            <div className="tasks-section white-section2">
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
            <div className="todo-list white-section2 ">
              <div  >
              <div class="row">
              <h3 className="col-sm" >To-do List </h3>
              <button class="col-sm" style={{"visibility" :"hidden"}}></button>
               <button className=" col-sm" onClick={() => setIsFormOpen(true)}>{/** needs to be next to title3 in second col */}
                Add Task
              </button>
              </div> 
         </div>
 
        <div className=" box-wrapper"> 
          {/* TO DO BOX */}
          <div className="box" style={{ backgroundColor: "#BEC7E7" }}>
            <h2>TO DO</h2>
            {tasks.todo.map((task, index) => (
              <div
                key={index}
                className="task"
                onClick={() => openEditForm(task, "todo")}
              >
                <span>{task.title}</span>
                <button
                  className="tasks-delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the task
                    deleteTask(task.title, "todo"); // or "inProgress", "done" as per column
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          {/* IN-PROGRESS BOX */}
          <div className="box" style={{ backgroundColor: "#7ccdde" }}>
            <h2>IN PROGRESS</h2>
            {tasks.inProgress.map((task, index) => (
              <div
                key={index}
                className="task"
                onClick={() => openEditForm(task, "inProgress")}
              >
                <span>{task.title}</span>
                <button
                  className="tasks-delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the task
                    deleteTask(task.title, "inProgress"); // For "In Progress" box
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          {/* DONE BOX */}
          <div className="box" style={{ backgroundColor: "#B7DBD1" }}>
            <h2>DONE</h2>
            {tasks.done.map((task, index) => (
              <div
                key={index}
                className="task"
                onClick={() => openEditForm(task, "done")}
              >
                <span>{task.title}</span>
                <button
                  className="tasks-delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up to the task
                    deleteTask(task.title, "done"); // For "Done" box
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>
 
        {/* Add/Edit Task Form */}
        {isFormOpen && (
          <div className="form-overlay">
            <div className="form-wrapper">
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
              <select
                className="form-select"
                name="currentProgress"
                value={newTask.currentProgress}
                onChange={handleFormChange}
              >
                <option value="todo">TO DO</option>
                <option value="inProgress">IN PROGRESS</option>
                <option value="done">DONE</option>
              </select>
              <input
                className="form-input"
                name="deadline"
                type="date"
                value={newTask.deadline}
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

        {/* <ToastContainer /> */}
         
         
             {/*end of list######### */}
            </div>
            
            {/* Post Section
            *{post1data}
            *{listdata}
            *for posts it should take data from database and read the variables one by one ig.
            */}
            <div className="posts white-section">
              <h3>Recent Posts</h3>
              <div className="post-grid">
                {projectData.map((item, index) => (
                  <div key={item.id} className="topic-card">
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
                      className={`category-label ${item.category}`}
                    >
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
