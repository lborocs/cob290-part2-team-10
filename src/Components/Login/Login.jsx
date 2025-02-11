import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import "./auth.css";

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    console.log("Sending data to PHP:", { Email: email, Password: password });
  
    try {
      const response = await fetch("http://localhost:8000/src/Components/Login/Login2.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password }), // Match PHP expected keys
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Received data:", data);
  
      if (data.db_status) {
        console.log("Database Status:", data.db_status);
      } else {
        console.warn("Database status not received.");
      }
  
      if (data.status === "success") {
        console.log("Login successful");
        console.log("User details:", data.user);
  
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        onLoginSuccess(data.user.role);
        navigate("/home");
      } else {
        setError(data.error || "Login failed");
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError("A network error occurred. Please try again.");
    }
  };
  

  const validatePassword = (password) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password)
    );
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Invalid email format. Please include an '@' symbol.");
    } else if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase and lowercase letters."
      );
    } else {
      navigate("/home");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const response = await fetch("http://localhost/forgot_password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, oldPassword, newPassword, confirmPassword }),
    });
  
    const data = await response.json();
  
    console.log("Database Status:", data.db_status);
  
    if (data.status === "success") {
      setSuccessMessage("Password changed successfully.");
      setError("");
      setIsForgotPassword(false);
    } else {
      setError(data.error || "Failed to reset password.");
    }
  };
  

  return (
    <div className="container">
      <div className="left-panel">
        <h1 className="loginslogan">
          {isRegister ? "Let's get started" : "Makes it All a Breeze"}
        </h1>
        <iframe
          className="animation login-animation"
          src="https://lottie.host/embed/36422f53-d041-45f6-b282-962c2277247b/UFWJnnbsVP.json"
        ></iframe>
      </div>
      <div className="right-panel">
        <div className="auth-box">
          <h2>
            {isRegister
              ? "Register"
              : isForgotPassword
              ? "Forgot Password"
              : "Log In"}
          </h2>
          <form
            onSubmit={
              isForgotPassword
                ? handleForgotPasswordSubmit
                : isRegister
                ? handleRegisterSubmit
                : handleLoginSubmit
            }
          >
            {isRegister && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            )}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            {!isForgotPassword && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            )}
            {isForgotPassword && (
              <>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </>
            )}
            <button type="submit" className="button">
              {isForgotPassword
                ? "Reset Password"
                : isRegister
                ? "Register"
                : "Sign In"}
            </button>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </form>
          <p className="link-text">
            {isForgotPassword ? (
              <span onClick={() => setIsForgotPassword(false)} className="link">
                Go back to login
              </span>
            ) : isRegister ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsRegister(false)} className="link">
                  Login here
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsRegister(true)} className="link">
                  Register Here
                </span>
              </>
            )}
          </p>
          {!isForgotPassword && !isRegister && (
            <p>
              <span
                onClick={() => setIsForgotPassword(true)}
                className="link-text"
              >
                Forgot Password?
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
