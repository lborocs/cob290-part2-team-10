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


// Database credentials
$servername = "sci-project.lboro.ac.uk";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "error" => "Database connection failed",
        "db_status" => "not_connected"  // Explicitly set db_status
    ]));
}

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['email'], $data['preferredName'])) {
    $email = $data['email'];
    $preferredName = $data['preferredName'];

    $query = "UPDATE employee SET preferredName = ? WHERE email = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $preferredName, $email);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["error" => "Failed to update profile"]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
