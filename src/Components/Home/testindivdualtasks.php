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
$empID=$_GET[empID] ;
$qy="Select TaskID,ProjectID,,title,Tasks.Description,Status,EmployeeID from `Tasks` LEFT join Projects on ProjectID where `EmployeeId`=".$empID." group by ProjectID";
$res=mysqli_query($qy);
$tryjsoning=array("complete"=>0,"not"=>0);
$i=mysqli_num_rows($res);
$indvprojects=array();
for($x=0;$x<$i;$x++){

while($row=mysqli_fetch_array($res)) {
  
  if ($row[5]==$empID){
    if($row[4]=="completed"){
      $tryjsoning["complete"]+=1;
    }
    else{
      $tryjsoning["not"]+=1;}
      $indvprojects[$row[2]]=array("title"=>$row[2],"tasksc"=>$tryjsoning["complete"],"tasksn"=>$tryjsoning["not"]);
    #row3 is desc
    #row2 is project title
  }
} }#check if list is iteratable on numbers as well
#group/filter by status where if comlpleted/not. results needed for bar chart
  mysqli_close($conn);
$i=0;
foreach($tryjsoning as $x=>$y){
  $l[$i]=$y;
  $i++;
}
$q=json_encode($l);
echo $q;  
?>
