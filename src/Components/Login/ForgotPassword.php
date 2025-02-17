<?php
// Allow cross-origin requests (for local development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once('../../../backend/config/db.php');
// Read the request body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["newPassword"])) {
    echo json_encode(["status" => "error", "error" => "Missing required fields"]);
    exit();
}

$email = $data["email"];
$newPassword = $data["newPassword"];

// Check if the email exists
$stmt = $conn->prepare("SELECT UserID FROM Employee WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "error" => "Email not found"]);
    exit();
}

// Hash the new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update the password in the database
$updateStmt = $conn->prepare("UPDATE Employee SET Password = ? WHERE Email = ?");
$updateStmt->bind_param("ss", $hashedPassword, $email);

if ($updateStmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password reset successfully"]);
} else {
    echo json_encode(["status" => "error", "error" => "Failed to update password"]);
}

$conn->close();
