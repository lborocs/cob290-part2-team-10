<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Initialise response array
$response = array();

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Database credentials
$servername = "localhost"; //localhost
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$dbname = "team010";

$conn = new mysqli($servername, $username, $password, $dbname);

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

// Validate userID parameter
if (!isset($_GET['UserID'])) {
  $response["status"] = "error";
  $response["message"] = "UserID parameter missing";
  echo json_encode($response);
  exit(); // Exit after sending error response
}
$userID = intval($_GET['UserID']); // Convert to integer for security

// Fetch user profile based on UserID
$sql = "
    SELECT e.Name AS name, e.Email AS email, e.PreferredName AS preferredName, r.Name AS position
    FROM Employee e
    JOIN Role r ON e.Role = r.ID
    WHERE e.UserID = $userID
";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  // Combine status and user data
  $response["user"] = $row;
  echo json_encode($response);
} else {
  $response["status"] = "error";
  $response["message"] = "No user found";
  echo json_encode($response);
}

$conn->close();
