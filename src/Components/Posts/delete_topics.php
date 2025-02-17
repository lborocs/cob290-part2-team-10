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

require_once('../../../backend/config/db.php');
$rawInput = file_get_contents("php://input");
error_log("Raw input: " . $rawInput); // Log the raw input for debugging
$data = json_decode($rawInput, true);


if (!$data || !isset($data['topicId'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit();
}

$topicId = (int)$data['topicId'];

$query = "DELETE FROM Topics WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $topicId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Topic deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleted topic: " . $stmt->error]);
}

$conn->close();
