<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}

$servername = "sci-project.lboro.ac.uk";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = new mysqli($servername, $username, $password, $database, 3306);

$rawInput = file_get_contents("php://input");
error_log("Raw input: " . $rawInput); // Log the raw input for debugging
$data = json_decode($rawInput, true);

//checks database connection 
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}


if (!$data || !isset($data['topicId'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit();
}

$topicId = (int)$data['topicId'];

$query = "DELETE FROM Topics WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i",$topicId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Topic deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleted topic: " . $stmt->error]);
}

$conn->close();
?>
