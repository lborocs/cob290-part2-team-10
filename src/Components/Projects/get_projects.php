<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *"); // Or specify frontend URL
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once('../../../backend/config/db.php');

// Fetch projects
// Get UserID from the request
$UserID = isset($_GET['UserID']) ? intval($_GET['UserID']) : 0;

// Fetch only projects assigned to this user
$sql = "SELECT p.id, p.title, p.description, p.teamleader, e.Name AS team_leader
        FROM Projects p
        LEFT JOIN Employee e ON p.teamleader = e.UserID
        JOIN ProjectAssignments pa ON p.id = pa.project_id
        WHERE pa.employee_id = $UserID";

$result = $conn->query($sql);


$projects = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $projectId = $row['id'];
        $teamLeaderId = $row['teamleader']; // Get team leader ID

        // Fetch team members, excluding the team leader
        $team_sql = "SELECT e.UserID, e.Name, e.Role FROM ProjectAssignments pa
                     JOIN Employee e ON pa.employee_id = e.UserID
                     WHERE pa.project_id = $projectId AND e.UserID != $teamLeaderId"; // Exclude leader
        $team_result = $conn->query($team_sql);

        $team_members = [];
        while ($team_row = $team_result->fetch_assoc()) {
            $team_members[] = [
                "name" => $team_row["Name"],
                "position" => $team_row["Role"],
            ];
        }

        // Fetch tasks
        $tasks_sql = "SELECT Description, Status FROM Tasks WHERE ProjectID = $projectId";
        $tasks_result = $conn->query($tasks_sql);

        $tasks = [];
        while ($task_row = $tasks_result->fetch_assoc()) {
            $tasks[] = [
                "description" => $task_row["Description"],
                "status" => $task_row["Status"],
            ];
        }

        // Fetch milestones
        $timeline_sql = "SELECT milestone, start_date, end_date, status FROM ProjectsTimeline WHERE project_id = $projectId";
        $timeline_result = $conn->query($timeline_sql);

        $milestones = [];
        while ($timeline_row = $timeline_result->fetch_assoc()) {
            $milestones[] = [
                "milestone" => $timeline_row["milestone"],
                "start_date" => $timeline_row["start_date"],
                "end_date" => $timeline_row["end_date"],
                "status" => $timeline_row["status"],
            ];
        }

        $projects[] = [
            "id" => $row["id"],
            "title" => $row["title"],
            "description" => $row["description"],
            "teamLeader" => isset($row["teamleader"]) ? [
                "id" => $row["teamleader"],
                "name" => $row["team_leader"] ?? "Not Assigned"
            ] : null,
            "teamMembers" => $team_members, // Filtered team members (team leader removed)
            "tasks" => $tasks,
            "milestones" => $milestones,
        ];
    }
}

// Ensure response is always JSON
if (empty($projects)) {
    echo json_encode(["error" => "No projects found."]);
} else {
    echo json_encode(["projects" => $projects]);
}

$conn->close();
