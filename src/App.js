// App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Projects from "./Components/Projects/Projects";
import ToDoList from "./Components/ToDo/ToDo";
import Home from "./Components/Home/Home";
import Posts from "./Components/Posts/Topics";
import ProfilePage from "./Components/user/ProfilePage";
import Sidebar from "./Components/Sidebar/Sidebar";
import Analytics from "./Components/Analytics/Analytics";
import AddProject from "./Components/Projects/AddProject";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // State to store user role
  const [showSidebar, setShowSidebar] = useState(true); // Sidebar collapse state

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    // Reset authentication state on logout
    setIsAuthenticated(false);
    setRole(null);
  };
  const storedUser = localStorage.getItem("user");
  const parsedUser = JSON.parse(storedUser);
  const toggleSidebar = () => {
    setShowSidebar((prevShow) => !prevShow);
  };

  return (
    <div className="App">
      <Router>
        <div className="sideflex">
          {isAuthenticated && (
            <Sidebar
              show={showSidebar}
              toggle={toggleSidebar}
              role={role}
              onLogout={handleLogout} // Pass handleLogout to Sidebar
            />
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            {isAuthenticated ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                {parsedUser.role === 1 && (
                  <Route path="/analytics" element={<Analytics />} />
                )}
                {parsedUser.role === 1 && (
                  <Route path="/add-project" element={<AddProject />} />
                )}
                <Route path="/todo" element={<ToDoList />} />
                {/* Pass isAdmin prop to ProfilePage */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/topics" element={<Posts />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
