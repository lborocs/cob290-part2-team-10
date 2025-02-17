<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS"); // Ensure OPTIONS is handled for preflight requests

header("Content-Type: application/json");  // Ensure JSON response format

require_once('../../../backend/config/db.php');

$empID = $_GET['empID'];
$query = "Delete * from To-Do-List where employeeID=" . $empID;
$result = mysqli_query($conn, $query);


mysqli_close($conn);

$conn = mysqli_connect($Servername, $Username, $Password, $Databasename);
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
$taskjson = file_get_contents('php://input');
$a = json_decode($taskjson);
for ($i = 0; $i < count($a); $i++) {
  $q = "Insert into To-Do-List (`employeeID`,`title`,`description`,`currentProgress`,`deadline`) values(" . $taskjson[$i] . id . "," . $taskjson[$i] . title . "," . $taskjson[$i] . description . "," . $taskjson[$i] . currentProgress . "," . $taskjson[$i] . deadline . ")";
  $result = mysqli_query($conn, $q);
  $row = mysqli_fetch_array($result);
}

mysqli_close($conn);
