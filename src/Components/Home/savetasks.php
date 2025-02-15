<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS"); // Ensure OPTIONS is handled for preflight requests
#header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
#header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
header("Content-Type: application/json");  // Ensure JSON response format
error_reporting(E_ALL);
ini_set('display_errors', 1);

$Servername="sci-project.lboro.ac.uk";
$Username="team010";
$Password="KsMzcqzsYEbKw4UWyvVT";
$Databasename="team010";
$conn = mysqli_connect($Servername, $Username, $Password, $Databasename);
if (!$conn) { 
  die("Connection failed: " . mysqli_connect_error()); } 
$empID=$_GET['empID'] ;
$query="Delete * from To-Do-List where employeeID=".$empID;
$result = mysqli_query($conn, $query);  


mysqli_close($conn);

$conn = mysqli_connect($Servername, $Username, $Password, $Databasename);
if (!$conn) { 
  die("Connection failed: " . mysqli_connect_error()); } 
$taskjson=json_encode($_POST['tasks']);
$a=json_decode($taskjson);
for ($i=0;$i<count($a) ; $i++){
$q="Insert into To-Do-List (`employeeID`,`title`,`description`,`currentProgress`,`deadline`) values(".$taskjson[$i].id.",".$taskjson[$i].title.",".$taskjson[$i].description.",".$taskjson[$i].prog.",".$taskjson[$i].deadline.")";
$result = mysqli_query($conn,$q);
$row = mysqli_fetch_array($result);
}

mysqli_close($conn);

?>
