
<?php
header("Access-Control-Allow-Origin:*");
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
 # echo "<body><script> console.log('Connected successfully') </script>";

#echo "s";
$query="SELECT * FROM `Topics` ";
try{
    $result=mysqli_query($conn,$query);
$row = mysqli_fetch_array($result);
#echo $row[1]; 
 #   echo $row[2];
  #  echo $row[3];
   # echo $row[4];
    #echo $row[5];
    #echo $row[6];
    #echo "<br>";
    #row 0 is the id
    #echo "yeah";  
    mysqli_close($conn); 
     # echo "el fin. ";
    echo json_encode($result);
  } catch(exception) {
    echo "Error: " . $query . "<br>" . mysqli_error($conn);
  }

?>

