<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Content-Type: application/json; charset=UTF-8"); // Ensure JSON response
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST & OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow required headers


// Database connection
$username = "team010";
$servername = "sci-project.lboro.ac.uk";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["db_status" => "Database connection failed", "error" => $conn->connect_error]);
    exit();
}

// Read input from React frontend
$data = json_decode(file_get_contents("php://input"));
if (!$data) {
  echo json_encode(["error" => "Invalid JSON format"]);
  exit();
}

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode(["db_status" => "Database connected", "error" => "Missing email or password"]);
    exit();
}

$email = $data->email;
$password = $data->password;

// Use prepared statements to prevent SQL injection
$sql = "SELECT Email, Role FROM Employee WHERE Email = ? AND Password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    echo json_encode([
        "db_status" => "Database connected", 
        "status" => "success",
        "message" => "Login successful",
        "user" => [
            "email" => $user['Email'],
            "role" => $user['Role']
        ]
    ]);
} else {
    echo json_encode(["db_status" => "Database connected", "error" => "Invalid credentials"]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
