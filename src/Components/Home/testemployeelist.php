<?php
#echo "pineapple";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ensure OPTIONS is handled for preflight requests
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
#$query="select * from `testemployeelist`";
#$result=mysqli_query($conn,$query);
#$row = mysqli_fetch_array($result);
#echo $row[1];
#$table=" `testemployeelist` ";
#INSERT INTO `testemployeelist` (`ID`, `firstname`, `lastname`, `role`, `email`) VALUES ('', '', '', '', '')
enum UserRole: string {
 case Admin = 'admin';
 case Employee = 'employee';
 case Manager = 'manager';
}
$role = UserRole::Admin->value;
echo $role;
$query= "INSERT INTO  `testemployeelist` ( `ID`, `firstname`, `lastname`, `role`, `email`)  VALUES (3, 'test22', 'test022', '{$role}','test22@email.com')"; 
#can insert data into database, leave id out of it

#echo $role.value;#->UserRole;


  try{
    mysqli_query($conn, $query); 
    echo "New record created successfully";  
    mysqli_close($conn); 
      echo "nah";
  } catch(exception) {
    echo "Error: " . $query . "<br>" . mysqli_error($conn);
  }

#  mysqli_close($conn); 
#echo "nah";
 # catch(exception){
#echo "x";echo "<br>";
  # echo "Error: " . $query . "<br>" . $conn->error;}
#if it writes ot the database, it refuses ot write anymore???

#ind way to end conection

?>
<?php
#this set should be in a different file preferably
$Servername="sci-project.lboro.ac.uk";
$Username="team010";
$Password="KsMzcqzsYEbKw4UWyvVT";
$Databasename="team010";

$conn = mysqli_connect($Servername, $Username, $Password, $Databasename);
if (!$conn) { 
die("Connection failed: " . mysqli_connect_error()); } 
echo "<script> console.log('Connected successfully') </script>";

echo "<br> hi";
 try{
$query2="select * from `testemployeelist`";
$result2=mysqli_query($conn,$query2);
   
   while ($row = mysqli_fetch_array($result2) ){
echo $row[0]." ".$row[1]." ".$row[2]." ".$row[3]." ".$row[4];
echo "<br>";
 }
 }
 catch(exception){echo "Error: " . $query2 . "<br>" . $conn->error;}
#echo $row[0].$row[1].$row[2].$row[3]
echo "end";
?>