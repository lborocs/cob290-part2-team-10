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
$servername = "sci-project.lboro.ac.uk";
$username = "team010";
$password = "KsMzcqzsYEbKw4UWyvVT";
$database = "team010";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
  echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
  exit;
}

// Check if a project ID was sent
if (!isset($_GET['project_id'])) {
  echo json_encode(["error" => "No project ID provided."]);
  exit;
}

$projectID = intval($_GET['project_id']);

// **Step 1: Get Project Details**
$projectSQL = "
    SELECT p.id AS ProjectID, p.title AS ProjectTitle, e.Name AS TeamLeader
    FROM Projects p
    JOIN Employee e ON p.teamleader = e.UserID
    WHERE p.id = $projectID
";

$projectResult = $conn->query($projectSQL);

if ($projectResult && $projectResult->num_rows > 0) {
  $projectData = $projectResult->fetch_assoc();
} else {
  echo json_encode(["error" => "Project not found."]);
  exit;
}

// **Step 2: Get Team Members**
$teamSQL = "
    SELECT e.Name
    FROM Employee e
    JOIN ProjectAssignments pa ON e.UserID = pa.employee_id
    WHERE pa.project_id = $projectID
";

$teamResult = $conn->query($teamSQL);
$teamMembers = [];

if ($teamResult && $teamResult->num_rows > 0) {
  while ($row = $teamResult->fetch_assoc()) {
    $teamMembers[] = $row['Name'];
  }
}

// **Step 3: Get Task Completion Summary**
$taskSQL = "
    SELECT 
        COUNT(*) AS TotalTasks,
        SUM(CASE WHEN Status = 'completed' THEN 1 ELSE 0 END) AS CompletedTasks
    FROM Tasks 
    WHERE ProjectID = $projectID
";

$taskResult = $conn->query($taskSQL);
$taskSummary = $taskResult->fetch_assoc();

// **Step 4: Get Project Timeline**
$timelineSQL = "
    SELECT milestone, start_date, end_date, status
    FROM ProjectsTimeline
    WHERE project_id = $projectID
    ORDER BY start_date ASC
";

$timelineResult = $conn->query($timelineSQL);
$timeline = [];

if ($timelineResult && $timelineResult->num_rows > 0) {
  while ($row = $timelineResult->fetch_assoc()) {
    $timeline[] = $row;
  }
}

// Prepare the response
$response = [
  "ProjectID" => $projectData['ProjectID'],
  "ProjectTitle" => $projectData['ProjectTitle'],
  "TeamLeader" => $projectData['TeamLeader'],
  "TeamMembers" => $teamMembers,
  "TotalTasks" => $taskSummary['TotalTasks'],
  "CompletedTasks" => $taskSummary['CompletedTasks'],
  "Timeline" => $timeline
];

// Close connection
$conn->close();

// Output JSON data
echo json_encode(["project_details" => $response], JSON_PRETTY_PRINT);
