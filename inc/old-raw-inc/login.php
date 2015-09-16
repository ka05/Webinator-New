<?php

$db = true;
include "pg_start/page_start.php";

$username = $_POST['username'];
$password = sha1($_POST['password']);

$query = "SELECT * FROM accounts WHERE username = '$username'";
$result = mysqli_query($link, $query);
$num_rows = mysqli_affected_rows($link);

if($result && $num_rows > 0){
  while($row = mysqli_fetch_assoc($result)){
    if($row['password'] == $password){
      //uncomment line below if you want confirmation when you log in
      $user_results = array("accountId" => $row["accountId"], "username" => $row['username']);
      echo json_encode($user_results);
    }
    else{
      echo "login failed";
    }
  }
}
else{
  echo "please register!";
}
?>