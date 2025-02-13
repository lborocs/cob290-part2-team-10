<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['topicId'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit();
}

$topicId = (int)$data['topicId'];
$likes   = isset($data['likes']) ? (int)$data['likes'] : null;
$comments = isset($data['comments']) ? json_encode($data['comments']) : null;

$query = "UPDATE Topics SET likes = ?, comments = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("isi", $likes, $comments, $topicId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Topic updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating topic: " . $stmt->error]);
}

$conn->close();
?>
