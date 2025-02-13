
<?php
header("Access-Control-Allow-Origin:*");
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
 # echo "<body><script> console.log('Connected successfully') </script>";

#echo "s";
$query="SELECT * FROM `Topics` ";

$tryjsoning=array();
$i=0;
try{
    $result=mysqli_query($conn,$query);
if (mysqli_num_rows($result) > 0){
  while ($row = mysqli_fetch_array($result)){ 
    $tryjsoning[$i]=array('id'=>$row[0],
      'title'=>$row[1],
      'content'=>$row[2],
      'image'=>$row[3],
      'category'=>$row[4], 
    'likes'=>$row[5],
    'comments'=>$row[6],
    'created'=>$row[7]);$i++;
  }}#if

    #row 0 is the id
     mysqli_close($conn); 
    
  } catch(exception) {
    echo "Error: " . $query . "<br>" . mysqli_error($conn);
  }
 
  $r=json_encode($tryjsoning);
  echo $r;
?>

