<?php
// Allow cross-origin requests (for local development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
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
// Read JSON input from React frontend
$rawData = file_get_contents("php://input");
error_log("Received raw data: " . $rawData);  // Log raw data to error log

if (!$rawData) {
    die(json_encode([
        "status" => "error",
        "error" => "No input data received",
        "db_status" => "connected"
    ]));
}

// Decode the JSON data
$data = json_decode($rawData, true);

// Check if JSON decoding is successful and the required fields exist
if (!$data || !isset($data["Email"]) || !isset($data["Password"])) {
    die(json_encode([
        "status" => "error",
        "error" => "Invalid input data",
        "db_status" => "connected"
    ]));
}

// Extract Email and Password
$email = $data["Email"];
$password = $data["Password"];
$name = $data["Name"];
$username = $data["UserName"];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Query to check user credentials
$sql = "INSERT INTO Employee ( Name, UserName, Password, Email, Role) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $name, $username, $hashedPassword, $email, $role);
$role = 2; // auto setting role to employee for new registrees 
$result = $stmt->get_result();
if ($stmt->execute()) {

    // Get the auto-generated UserID
    $userID = $conn->insert_id;

    echo json_encode([
        "status" => "success",
        "db_status" => "connected",
        "user" => [
            "id" => $userID,
            "username" => $username,
            "email" => $email,
            "role" =>  $role,
            "name" => $name,
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "error" => "Failed to register user.",
        "db_status" => "connected"
    ]);
}


// Close connection
$stmt->close();
$conn->close();
