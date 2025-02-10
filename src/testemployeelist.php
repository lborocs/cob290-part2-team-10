<?php
#echo "pineapple";
$Servername="sci-project.lboro.ac.uk";
$Username="team010";
$Password="KsMzcqzsYEbKw4UWyvVT";
$Databasename="team010";
$conn = mysqli_connect($Servername, $Username, $Password, $Databasename);
if (!$conn) { 
  die("Connection failed: " . mysqli_connect_error()); } 
  echo "<script> console.log('Connected successfully') </script>";
#echo "s";
$quesry="select * from test employee list";
$result=mysqli_query($conn,query: $query);
$row = mysqli_fetch_array($result);
?>