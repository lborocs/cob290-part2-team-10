<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS"); // Ensure OPTIONS is handled for preflight requests
#header("Access-Control-Allow-Headers: *"); // Allow Authorization header if needed
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
  echo "<script> console.log('Connected successfully') </script>";

echo "s";
$query="SELECT * FROM `Topics` ";
try{
    mysqli_query($conn, $query); 
    echo "New record created successfully";  
    mysqli_close($conn); 
      echo "nah";
  } catch(exception) {
    echo "Error: " . $query . "<br>" . mysqli_error($conn);
  }

?>