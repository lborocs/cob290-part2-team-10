import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import "./auth.css";


const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  console.log(isRegister);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    console.log("Sending data to PHP:", { Email: email, Password: password });
  
    try {
      const response = await fetch("http://localhost:8000/Login/Login2.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }), // Match PHP expected keys
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        const userRole = data.user.role === "manager" ? "manager" : "employee"; // Ensure role mapping


        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data in localStorage
        onLoginSuccess(userRole);
        navigate("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError("A network error occurred. Please try again.");
    }
  };

  const validatePassword = () => {
    if (
      password.length >= 8 &&  // Minimum length of 8
      /[A-Z]/.test(password) && // At least one uppercase letter
      /[a-z]/.test(password) && // At least one lowercase letter
      /[0-9]/.test(password) && // At least one number
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // At least one special character
    ) {
      if (password === confirmPassword) {
        handleRegisterSubmit();
      } else {
        setError("Passwords need to match");
      }
    } else {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
  };
  
  
  const validateEmail  = async (e) => {
    e.preventDefault();
    console.log("Sending register validateemail data to PHP:", { Email: email, Password: password, Name: name, Username: username});
    var test = true; 
    try {
      // Fetch registered emails from the backend
      const response = await fetch("http://localhost:8000/Login/RegistrationVerification.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }) ,
      });
  
      const data = await response.json(); 
      
      if (data.status === "error") {
        setError("Registration unsuccessful: " + data.message);
        test=false;
      }
      console.log(data);
      console.log(data.exists);
      if (!data.exists) {
             // Check if email is valid (must end with @make-it-all.com)
    if (email.endsWith("@make-it-all.com")) {
      console.log("Sending register validateemail data to PHP2:", { Email: email, Password: password, Name: name, Username: username});
      test=false; // Invalid email format
      validatePassword();
    }else{
      setError("Registration unsuccessful: Email must end with @make-it-all.com");
    }
      }
      else{
        console.log("128 log", data);
        setError("Registration unsuccessful: Email already registered" );
        return true; 
      }
    
    }
    catch (error) {
      console.error("Error checking email:", error);
      setError("An error occurred while checking email. Please try again.");
      test=false;
    }
    return test
  };
  

  const handleRegisterSubmit = async () =>{
    setError("");
      try {
        const response = await fetch("http://localhost:8000/Login/Registration.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email: email, Password: password, UserName: username, Name: name }), // Match PHP expected keys
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.db_status) {
          console.log("Database Status:", data.db_status);
        } else {
          console.warn("Database status not received.");
        }
    
        if (data.status === "success") {
          console.log("Registration successful");
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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/; //ensured password is of right format
  // ensures user submits  something into text field before update is made
    if (!email) {
      setError("Please enter your email.");
      return;
    }
  
    if (!newPassword || !confirmPassword) {
      setError("Please enter a new password and confirm it.");
      return;
    }
  
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/Login/ForgotPassword.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
          setSuccessMessage("Password changed successfully.");
          setIsForgotPassword(false);
      } else if (data.error === "Email not found") {
          setError("This account does not exist. Please check your email and try again.");
      } else {
          setError(data.error || "Failed to reset password.");
      }
  } catch (error) {
      setError("An error occurred while resetting your password. Please try again.");
  }
}
  
  
  
  

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
              isRegister
                ? validateEmail
                : isForgotPassword
                ? handleForgotPasswordSubmit
                : handleLoginSubmit
            }
          >
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
            {isRegister && (
               <div>
               <input
                 type="text"
                 placeholder="Name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="input-field"
               />
               <input
                 type="text"
                 placeholder="Username"
                 value={username}
                 onChange={(e) => setUserName(e.target.value)} 
                 className="input-field"
               />
               <input
                 type="password"
                 placeholder="Confirm Password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="input-field"
               />
             </div>
            )}

            {isForgotPassword && (
              <>
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
                <span onClick={() => {setIsRegister(true)}} className="link">
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
