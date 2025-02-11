<?php
header("Access-Control-Allow-Origin: https://3002-idx-test5-1739208821837.cluster-rz2e7e5f5ff7owzufqhsecxujc.cloudworkstations.dev/home,https://3000-idx-test5-1739208821837.cluster-rz2e7e5f5ff7owzufqhsecxujc.cloudworkstations.dev/home,http://localhost:3000,http://localhost:3002,http://localhost:8080");
header("Access-Control-Allow-Methods: POST,GET,OPTIONS"); // Ensure OPTIONS is handled for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Authorization header if needed
header("Access-Control-Allow-Credentials: true"); // Allow credentials if using sessions or cookies
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