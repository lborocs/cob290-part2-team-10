  <?php
  // Database configuration
  $servername = "sci-project.lboro.ac.uk";
  $username = "team010";
  $password = "KsMzcqzsYEbKw4UWyvVT";
  $database = "team010";

  $conn = new mysqli($servername, $username, $password, $database);

  if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
  }

  // Set character encoding to avoid issues
  $conn->set_charset("utf8");

  ?>
