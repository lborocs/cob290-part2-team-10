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
  #echo "<script> console.log('Connected successfully') </script>";


  #INSERT INTO `testemployeelist` (`ID`, `firstname`, `lastname`, `role`, `email`) VALUES ('', '', '', '', '')
enum taskstatus: string {
 case todo = 'todo';
 case InProgress = 'InProgress';
 case Done = 'Done';
}
#$role = taskstatus::todo->value;

#$empID=json_decode(file_get_contents("php://input"));
$empID=2;
$query= "Select * from `To-Do-List` where `employeeID`=".$empID ; 

 #employeeid (needs querying to compare, task id, titl, desc,progr,deadl)

$tryjsoning=array();
  try{
      $result=mysqli_query($conn, $query);
      echo mysqli_num_rows($result);
      for ( $i=0;$i<mysqli_num_rows($result);$i++ ){
    $row = mysqli_fetch_array($result);
           $a=array(   'employeeID'=>$row[0], 'TaskID'=>$row[1], 'title'=>$row[2], 'description'=>$row[3],    'currentProgress'=>$row[4], 'deadline'=>$row[5] );
          $tryjsoning[$i]=$a;


          echo "$row[2]"; 
    }
      
     
    mysqli_close($conn); 
     # echo "nah";
  } catch(exception) {
    echo "Error: " . $query . "<br>" . mysqli_error($conn);
  }


$q=json_encode($tryjsoning);

echo $q;
?>