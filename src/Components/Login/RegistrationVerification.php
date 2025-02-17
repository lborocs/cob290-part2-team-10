<?php
// Allow cross-origin requests (for local development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorisation header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight OPTIONS request (important for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require_once('../../../backend/config/db.php');
// Get JSON input from request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["Email"])) {
  echo json_encode(["status" => "error", "message" => "Email parameter missing"]);
  exit();
}

$email = $conn->real_escape_string($data["Email"]);

// Check if email exists in the Employee table
$sql = "SELECT COUNT(*) as count FROM Employee WHERE Email = '$email'";
$result = $conn->query($sql);

if ($result) {
  $row = $result->fetch_assoc();
  $emailExists = $row['count'] > 0; // Check if count is greater than 0

  echo json_encode(["status" => "success", "exists" => $emailExists]);
} else {
  echo json_encode(["status" => "error", "message" => "Database query failed"]);
}

//connection closed
$conn->close();
