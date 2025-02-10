<?php
header("Access-Control-Allow-Origin: *"); // Or specify frontend URL
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT UserID, Name FROM Employee";
$result = $conn->query($sql);

$employees = [];
while ($row = $result->fetch_assoc()) {
    $employees[] = ["id" => $row["UserID"], "name" => $row["Name"]];
}

echo json_encode(["employees" => $employees]);

$conn->close();
?>
