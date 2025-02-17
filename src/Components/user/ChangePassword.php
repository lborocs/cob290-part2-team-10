<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
// Initialise response array
$response = array();

// Connect to the database
$servername = "localhost";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";
$conn = new mysqli($servername, $username, $password, $database);

// Check database connection
if ($conn->connect_error) {
  $response["status"] = "error";
  $response["message"] = "Connection failed: " . $conn->connect_error;
  echo json_encode($response);
  exit(); // Exit after sending error response
} else {
  $response["status"] = "success";
  $response["message"] = "Database connected successfully";
}
$rawData = file_get_contents("php://input");

error_log("Raw Data: " . $rawData);
// Get data from POST request

$data = json_decode($rawData, true);

if (!$data) {
  echo json_encode([
    "error" => "Invalid JSON received",
    "data" => file_get_contents("php://input"),
    "json_error" => json_last_error_msg() // Get detailed error message

  ]);
  exit();
}
if (!isset($data["UserID"], $data["newPassword"])) {
  echo json_encode(["status" => "error", "error" => "Missing UserID or newPassword"]);
  exit();
}

$userID = intval($data["UserID"]);
$newPassword = $data["newPassword"];

// Validate password length (for example, minimum of 8 characters)
if (strlen($newPassword) < 8) {
  echo json_encode(["status" => "error", "error" => "Password must be at least 8 characters long"]);
  exit();
}

$checkQuery = "SELECT UserID, Password FROM Employee WHERE UserID = ?";
$stmtCheck = $conn->prepare($checkQuery);
$stmtCheck->bind_param("i", $userID);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$user = $result->fetch_assoc();
$stmtCheck->close();

if (!$user) {
  echo json_encode(["status" => "error", "error" => "User not found in the database"]);
  exit();
}

// Hash the new password securely
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password in the database (using the existing `Password` column)
$updateQuery = "UPDATE Employee SET Password = ? WHERE UserID = ?";
$stmt = $conn->prepare($updateQuery);
$stmt->bind_param("si", $hashedPassword, $userID);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
  } else {
    echo json_encode(["status" => "error", "error" => "No rows updated. UserID might not exist."]);
  }
} else {
  echo json_encode(["status" => "error", "error" => "Failed to update password"]);
}


$stmt->close();
$conn->close();
