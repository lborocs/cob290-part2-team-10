<?php
// Allow cross-origin requests (for local development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = array();

// Handle preflight OPTIONS request (important for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Database credentials
$servername = "localhost";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

// Connect to MySQL
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
$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON was received correctly
if (!$data) {
    echo json_encode([
        "error" => "Invalid JSON received",
        "data" => file_get_contents("php://input")
    ]);
    exit();
}

// Check if required fields exist
if (!isset($data['UserID'], $data['PreferredName'])) {
    echo json_encode($response);
    exit();
}

// Extract values after validation
$UserID = $data['UserID'];
$preferredName = $data['PreferredName'];

// Log received data
error_log("UserID: $UserID, PreferredName: $preferredName");

// Prepare SQL query
$query = "UPDATE Employee SET PreferredName = ? WHERE UserID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $preferredName, $UserID);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["error" => "Failed to update profile"]);
}

// Close statement and database connection
$stmt->close();
$conn->close();
