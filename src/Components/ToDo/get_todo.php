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

// Query to fetch tasks assigned to the employee
$query = "SELECT * FROM Tasks WHERE EmployeeID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

// Initialize tasks structure
$tasks = ["pending" => [], "ongoing" => [], "complete" => []];

while ($row = $result->fetch_assoc()) {
  $taskData = [
    "TaskID" => $row["TaskID"],
    "ProjectID" => $row["ProjectID"],
    "title" => $row["Description"], // Use Description as title
    "Status" => strtolower($row["Status"]), // Ensure lowercase consistency
    "DueDate" => $row["DueDate"],
    "EmployeeID" => $row["EmployeeID"],
    "ManagerID" => $row["ManagerID"],
    "Rating" => $row["Rating"],
    "Category" => $row["Category"]
  ];

  // Assign task based on its Status
  if ($taskData["Status"] === "pending") {
    $tasks["pending"][] = $taskData;
  } elseif ($taskData["Status"] === "completed") {
    $tasks["complete"][] = $taskData;
  } elseif ($taskData["Status"] === "ongoing") {
    $tasks["ongoing"][] = $taskData;
  } else {
    $tasks["pending"][] = $taskData; // Default to pending if status is unrecognized
  }
}

// Return JSON response
echo json_encode(["status" => "success", "tasks" => $tasks]);

// Close connection
$stmt->close();
$conn->close();
