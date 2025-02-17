<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Get data from frontend
$data = json_decode(file_get_contents("php://input"), true);

// Check if userID is present in the received data
if (isset($data["userID"])) {
    $_SESSION["userID"] = $data["userID"];  // Store userID in session
}
require_once('../../../backend/config/db.php');
// Validate the incoming data
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data received."]);
    exit();
}

// Validate required fields
$requiredFields = ['title', 'description', 'teamLeader', 'projectPhases', 'tasks'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing field: $field"]);
        exit();
    }
}

$response = ["success" => true, "message" => "Project added successfully"];

// Assigning values from frontend data
$title = $data['title'];
$description = $data['description'];
$teamLeader = $data['teamLeader'];
$phases = $data['projectPhases'];
$tasks = $data['tasks'];
$assignments = isset($data['assignments']) ? $data['assignments'] : [];

// Insert the project data into the database
$query = "INSERT INTO Projects (title, description, teamleader) VALUES (?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssi", $title, $description, $teamLeader);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Project insertion failed: " . $stmt->error]);
    exit();
}
$projectId = $conn->insert_id;

// Insert project phases
if (!empty($phases)) {
    foreach ($phases as $phase) {
        if (!isset($phase['name'], $phase['startDate'], $phase['endDate'])) continue;
        $phaseName = $phase['name'];
        $phaseStartDate = $phase['startDate'];
        $phaseEndDate = $phase['endDate'];

        $query = "INSERT INTO ProjectsTimeline (project_id, milestone, start_date, end_date, status) VALUES (?, ?, ?, ?, 'Not Started')";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("isss", $projectId, $phaseName, $phaseStartDate, $phaseEndDate);
        if (!$stmt->execute()) {
            $response["success"] = false;
            $response["message"] = "Error adding project phase: " . $stmt->error;
            echo json_encode($response);
            exit();
        }
    }
}

// Insert team assignments
foreach ($assignments as $assignment) {
    $employeeId = $assignment['employee_id'];
    $isTeamLeader = $assignment['is_team_leader'];

    $query = "INSERT INTO ProjectAssignments (project_id, employee_id, is_team_leader) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $projectId, $employeeId, $isTeamLeader);

    if (!$stmt->execute()) {
        $response["success"] = false;
        $response["message"] = "Error adding assignment: " . $stmt->error;
        echo json_encode($response);
        exit();
    }
}

// Insert tasks
if (!empty($tasks)) {
    foreach ($tasks as $task) {
        if (!isset($task['description'], $task['assignedTo'], $task['dueDate'], $task['category'])) continue;
        $description = $task['description'];
        $assignedTo = $task['assignedTo'];
        $dueDate = $task['dueDate'];
        $category = $task['category'];

        $query = "INSERT INTO Tasks (ProjectID, Description, Status, EmployeeID, ManagerID, DueDate, Category) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";

        $status = "pending";
        $managerID = $_SESSION["userID"];

        $stmt = $conn->prepare($query);
        $stmt->bind_param("issiiis", $projectId, $description, $status, $assignedTo, $managerID, $dueDate, $category);
        if (!$stmt->execute()) {
            $response["success"] = false;
            $response["message"] = "Error adding task: " . $stmt->error;
            echo json_encode($response);
            exit();
        }
    }
}

// Final JSON response
echo json_encode($response);
