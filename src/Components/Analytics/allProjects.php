<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('../../../backend/config/db.php');
// Fetch projects
$sql = "SELECT id AS ProjectID, title AS ProjectTitle FROM Projects";
$result = $conn->query($sql);

$projects = [];
while ($row = $result->fetch_assoc()) {
  $projects[] = $row;
}

echo json_encode(["projects" => $projects], JSON_PRETTY_PRINT);
$conn->close();
