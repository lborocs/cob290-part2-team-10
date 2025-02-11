<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "profileSection";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if email parameter is set
if (!isset($_GET['email'])) {
    die(json_encode(["status" => "error", "message" => "Email parameter missing"]));
}

$email = $conn->real_escape_string($_GET['email']);

$sql = "SELECT email, preferredName, position FROM employee WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(["status" => "error", "message" => "No user found"]);
}

$conn->close();
?>
