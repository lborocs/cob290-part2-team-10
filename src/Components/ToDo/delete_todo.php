<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require_once('../../../backend/config/db.php');

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!isset($data["TaskID"])) {
  echo json_encode(["status" => "error", "message" => "TaskID missing"]);
  exit();
}

$query = "DELETE FROM Tasks WHERE TaskID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $data["TaskID"]);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Task deleted successfully"]);
} else {
  echo json_encode(["status" => "error", "message" => "Failed to delete task"]);
}

$stmt->close();
$conn->close();
