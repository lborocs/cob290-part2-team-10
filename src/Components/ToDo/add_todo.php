<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require_once('../../../backend/config/db.php');

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!isset($data["title"], $data["Status"], $data["DueDate"], $data["EmployeeID"], $data["ProjectID"])) {
  echo json_encode(["status" => "error", "message" => "Missing required fields"]);
  exit();
}

$query = "INSERT INTO Tasks (ProjectID, Description, Status, DueDate, EmployeeID, ManagerID, Rating, Category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("isssiiis", $data["ProjectID"], $data["title"], $data["Status"], $data["DueDate"], $data["EmployeeID"], $data["ManagerID"], $data["Rating"], $data["Category"]);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Task added successfully"]);
} else {
  echo json_encode(["status" => "error", "message" => "Failed to add task"]);
}

$stmt->close();
$conn->close();
