<?php
// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');

require_once('../../../backend/config/db.php');

// **Step 1: Get Project with Lowest Average Rating**
$lowestRatedProjectSQL = "
    SELECT p.id AS ProjectID, p.title AS ProjectTitle, p.teamleader AS TeamLeaderID, 
           AVG(t.Rating) AS AvgRating
    FROM Projects p
    JOIN Tasks t ON p.id = t.ProjectID
    WHERE t.Rating IS NOT NULL
    GROUP BY p.id
    ORDER BY AvgRating ASC
    LIMIT 1
";

$projectResult = $conn->query($lowestRatedProjectSQL);

if ($projectResult && $projectResult->num_rows > 0) {
  $lowestProject = $projectResult->fetch_assoc();
  $projectID = $lowestProject['ProjectID'];
  $projectTitle = $lowestProject['ProjectTitle'];
  $teamLeaderID = $lowestProject['TeamLeaderID'];
  $avgRating = $lowestProject['AvgRating'];

  // **Step 1: Get the 5 lowest-rated tasks across all projects**
  $lowestTasksSQL = "
    SELECT t.TaskID, t.Description AS TaskName, t.Rating, 
           e.Name AS EmployeeName, p.title AS ProjectTitle
    FROM Tasks t
    JOIN Employee e ON t.EmployeeID = e.UserID
    JOIN Projects p ON t.ProjectID = p.id
    WHERE t.Rating IS NOT NULL
    ORDER BY t.Rating ASC
    LIMIT 5
";

  $taskResult = $conn->query($lowestTasksSQL);
  $lowestRatedTasks = [];

  while ($task = $taskResult->fetch_assoc()) {
    $lowestRatedTasks[] = [
      "TaskID" => $task['TaskID'],
      "TaskName" => $task['TaskName'],
      "Rating" => $task['Rating'],
      "EmployeeName" => $task['EmployeeName']
    ];
  }

  // **Step 3: Get Team Leader Name**
  $teamLeaderSQL = "SELECT Name FROM Employee WHERE UserID = $teamLeaderID";
  $teamLeaderResult = $conn->query($teamLeaderSQL);
  $teamLeaderName = ($teamLeaderResult && $teamLeaderResult->num_rows > 0)
    ? $teamLeaderResult->fetch_assoc()['Name']
    : "Unknown";

  // Prepare the response
  $response = [
    "ProjectID" => $projectID,
    "ProjectTitle" => $projectTitle,
    "TeamLeaderName" => $teamLeaderName,
    "AvgRating" => round($avgRating, 2),
    "LowestRatedTasks" => $lowestRatedTasks
  ];
} else {
  $response = ["error" => "No projects with ratings found."];
}

// Close connection
$conn->close();

// Output JSON data
echo json_encode(["lowest_rated_project" => $response], JSON_PRETTY_PRINT);
