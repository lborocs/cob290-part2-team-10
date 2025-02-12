<?php
// Allow cross-origin requests (for local development)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight OPTIONS request (important for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Database credentials
$servername = "sci-project.lboro.ac.uk";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "error" => "Database connection failed",
        "db_status" => "not_connected"  // Explicitly set db_status
    ]));
}

// Read JSON input from React frontend
$rawData = file_get_contents("php://input");
error_log("Received raw data: " . $rawData);  // Log raw data to error log (use cautiously in production)

if (!$rawData) {
    die(json_encode(["status" => "error", 
                     "error" => "No input data received",
                    "db_status" => "connected"  // Add db_status for consistency
                    ]));
}

// Decode the JSON data
$data = json_decode($rawData, true);

// Check if JSON decoding is successful and the required fields exist
if (!$data || !isset($data["Email"]) || !isset($data["Password"])) {
    die(json_encode(["status" => "error", 
                     "error" => "Invalid input data", 
                     "db_status" => "connected"  // Add db_status for consistency
    ]));
}

// Extract Email and Password
$email = $data["Email"];
$password = $data["Password"];

// Query to check user credentials
$sql = "SELECT UserID, Username, Password, Role FROM Employee WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Verify user existence and password
if ($user && $password === $user["Password"]) {
    // Set cookies for UserID and Role

    echo json_encode([
        "status" => "success",
        "db_status" => "connected", // Add this line to log connection status
        "user" => [
            "id" => $user["UserID"],
            "username" => $user["Username"],
            "email" => $email,
            "role" => $user["Role"] == 1 ? "manager" : "user"  // Show 'manager' or 'user'
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "error" => "Invalid login credentials",  "db_status" => "connected"]);
}

// Close connection
$stmt->close();
$conn->close();
?>
