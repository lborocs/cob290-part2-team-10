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
require_once('../../../backend/config/db.php');
$query = "SELECT * FROM Topics ORDER BY created_at DESC";
$result = $conn->query($query);
$topics = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ensure comments is an empty array if null or empty
        $row['comments'] = !empty($row['comments']) ? json_decode($row['comments'], true) : [];
        $row['likes'] = isset($row['likes']) ? (int)$row['likes'] : 0;
        $topics[] = $row;
    }
}

echo json_encode($topics);
$conn->close();
