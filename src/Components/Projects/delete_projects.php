<?php
// Allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Changed DELETE to POST
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once "../../../backend/config/db.php"; // Update path if needed

// Handle preflight request (CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

// Read JSON input
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data["project_id"])) {
  echo json_encode(["status" => "error", "message" => "Project ID missing"]);
  exit();
}

$project_id = $conn->real_escape_string($data["project_id"]);

// Prepare delete query
$sql = "DELETE FROM Projects WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $project_id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Project deleted successfully"]);
} else {
  echo json_encode(["status" => "error", "message" => "Failed to delete project"]);
}

// Close connection
$stmt->close();
$conn->close();
