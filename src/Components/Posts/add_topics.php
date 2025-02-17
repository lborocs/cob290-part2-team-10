<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}
require_once('../../../backend/config/db.php');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data received."]);
    exit();
}

// Validate required fields
$requiredFields = ['title', 'content', 'category'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing field: $field"]);
        exit();
    }
}

// Assign values from frontend data; use provided likes and comments if available
$title    = $conn->real_escape_string($data['title']);
$content  = $conn->real_escape_string($data['content']);
$category = $conn->real_escape_string($data['category']);
$image    = isset($data['image']) ? $conn->real_escape_string($data['image']) : "";

$likes    = isset($data['likes']) ? (int)$data['likes'] : null; // use null if not provided
$comments = isset($data['comments']) ? json_encode($data['comments']) : null; // leave as null if not provided

$query = "INSERT INTO Topics (title, content, category, image, likes, comments, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssiss", $title, $content, $category, $image, $likes, $comments);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Error adding topic: " . $stmt->error]);
    exit();
}

$topicId = $conn->insert_id;

echo json_encode(["success" => true, "message" => "Topic added successfully", "topicId" => $topicId]);

$conn->close();
