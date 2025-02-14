<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "sci-project.lboro.ac.uk";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch projects
$sql = "SELECT id AS ProjectID, title AS ProjectTitle FROM Projects";
$result = $conn->query($sql);

$projects = [];
while ($row = $result->fetch_assoc()) {
  $projects[] = $row;
}

echo json_encode(["projects" => $projects], JSON_PRETTY_PRINT);
$conn->close();
