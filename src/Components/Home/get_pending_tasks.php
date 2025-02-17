<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Include database connection
require_once('../../../backend/config/db.php');

// Get userID from request parameters
$userID = isset($_GET["userID"]) ? $conn->real_escape_string($_GET["userID"]) : null;

if (!$userID) {
  echo json_encode(["status" => "error", "message" => "userID parameter missing"]);
  exit();
}

// Query to fetch only 'pending' tasks assigned to the user
$query = "SELECT TaskID, Description AS title, DueDate FROM Tasks WHERE EmployeeID = ? AND Status = 'pending'";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];

while ($row = $result->fetch_assoc()) {
  $tasks[] = [
    "TaskID" => $row["TaskID"],
    "title" => $row["title"],
    "DueDate" => $row["DueDate"],
  ];
}

// Return JSON response
echo json_encode(["status" => "success", "tasks" => $tasks]);

// Close connection
$stmt->close();
$conn->close();
