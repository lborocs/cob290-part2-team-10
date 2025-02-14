<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

// Database connection
$servername = "sci-project.lboro.ac.uk"; // Remote host
$username = "team010";  // Database username
$password = "KsMzcqzsYEbKw4UWyvVT";  // Database password
$database = "team010"; // Database name

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
  exit;
}

// Fetch employee task summary + detailed tasks per employee
$sql = "
    SELECT e.Name, 
           t.TaskID,
           t.Description,
           t.Status,
           t.DueDate,
           t.Category
    FROM Employee e
    LEFT JOIN Tasks t ON e.UserID = t.EmployeeID
    WHERE t.DueDate IS NOT NULL 
    AND t.DueDate != '0000-00-00'
    ORDER BY e.Name, t.DueDate ASC
";

$result = $conn->query($sql);

$data = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $employeeName = $row["Name"];

    if (!isset($data[$employeeName])) {
      $data[$employeeName] = [
        "Name" => $employeeName,
        "TotalTasks" => 0,
        "Pending" => 0,
        "Completed" => 0,
        "Tasks" => []
      ];
    }

    // Count tasks
    $data[$employeeName]["TotalTasks"]++;
    if ($row["Status"] === "pending") {
      $data[$employeeName]["Pending"]++;
    } elseif ($row["Status"] === "completed") {
      $data[$employeeName]["Completed"]++;
    }

    // Store task details
    $data[$employeeName]["Tasks"][] = [
      "TaskID" => $row["TaskID"],
      "Description" => $row["Description"],
      "Status" => $row["Status"],
      "DueDate" => $row["DueDate"],
      "Category" => $row["Category"]
    ];
  }
} else {
  echo json_encode(["error" => "SQL query failed: " . $conn->error]);
  exit;
}

// Sort employees by TotalTasks in descending order (Highest tasks first)
usort($data, function ($a, $b) {
  return $b['TotalTasks'] - $a['TotalTasks'];
});

$conn->close();

// Output JSON data
echo json_encode(["tasks" => array_values($data)], JSON_PRETTY_PRINT);
