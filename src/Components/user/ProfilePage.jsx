import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import "./ProfilePage.css";

const ProfilePage = ({ isAdmin }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: "",
    preferredName: "",
    position: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [storedPreferredName, setstoredPreferredName] = useState("");
  const [userId, setUserId] = useState(null); // Initialise state with null or an empty value
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id) {
        setUserId(parsedUser.id); // Set the user ID
        console.log("User ID from localStorage:", parsedUser.id);
      } else {
        console.warn("User ID field missing in localStorage user object.");
      }
    } else {
      console.warn("No user found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return; // Ensure email is set before fetching

      try {
        console.log("Fetching profile data for UserID:", userId);
        const response = await fetch(
          `http://localhost:8000/user/ProfileData.php?UserID=${user.id}`
        );
        if (!userId) {
          console.error("User ID missing");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        // Check if the response status is 'success' before setting the profile data
        if (data.status === "success") {
          setProfileData({
            preferredName: data.user.preferredName, // Use stored name if available
            email: data.user.email,
            position: data.user.position,
          });
        } else {
          console.error("Failed to fetch valid user data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]); // Re-fetch when userId is set

  const handleSaveProfile = async () => {
    try {
      const dataToSend = {
        UserID: user.id,
        PreferredName: profileData?.preferredName,
      };
      const response = await fetch(
        "http://localhost:8000/user/UpdateProfile.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setIsEditing(false); // Exit editing mode
        console.log("Profile saved successfully");
      } else {
        console.error("Failed to save profile:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    ) {
      alert(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (!userId) {
      alert("UserID not found. Please refresh the page.");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        UserID: userId,
        newPassword: newPassword,
      };
      // This will log the properly formatted JSON string
      console.log("Payload being sent:", JSON.stringify(payload));

      console.log("Payload being sent:", payload);
      const response = await fetch(
        "http://localhost:8000/user/ChangePassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log({
        UserID: userId,
        newPassword: newPassword,
      });
      if (data.status === "success") {
        alert("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.error || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if(){}
  return (
    <div className="profile-main">
      <div className="profile-page-container">
        <div className="user-info">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
          <Avatar
            name={profileData.preferredName || "User"}
            round={true}
            size="50"
            color="#0a6476"
          />
        </div>
        <h1 className="profilepage-title">User Profile</h1>
        <div className="profile-grid-container">
          <div className="profile-user-profile">
            <div className="profile-user-image">
              <FontAwesomeIcon
                icon={faUserCircle}
                size="5x"
                className="user-profile-icon"
              />
            </div>
            <div className="user-change-details">
              <div className="profile-user-details">
                <h2>Personal Information</h2>
                <div>
                  <label>Email: </label>
                  {profileData.email || "N/A"}
                </div>
                <div>
                  <label>Preferred Name: </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.preferredName || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferredName: e.target.value, //update preferred name in state
                        }))
                      }
                    />
                  ) : (
                    <div>
                      <span>{profileData.preferredName || "N/A"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label>Position: </label>
                  {profileData.position || "N/A"}
                </div>
                {isEditing ? (
                  <button onClick={handleSaveProfile}>Save</button> //save button to save the changes
                ) : (
                  <button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button> // Edit button to switch to the editting mode
                )}
              </div>

              <div className="profile-password-management">
                <h2>Password Management</h2>
                <div>
                  <label>New Password: </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <i onClick={() => setShowNewPassword(!showNewPassword)}>👁</i>
                </div>
                <div>
                  <label>Confirm New Password: </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <i
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    👁
                  </i>
                </div>
                <button onClick={handlePasswordChange} disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
