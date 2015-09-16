<?php
    $db = true;
    include "pg_start/page_start.php";
    
    function sanitize($link, $data){
        $data = trim($data);
        $data = htmlentities($data);
        $data = mysqli_real_escape_string($link, $data);
        return $data;
    }
    

    $username = sanitize($link, $_POST['username']);
    $password = sanitize($link, $_POST['password']);
    $email = sanitize($link, $_POST['email']);
    $password = sha1($password);
    
    if( empty($username)){
	  $errors[] = "Please enter a username! \n";
	}
    
    if( empty($password)){
	  $errors[] = "Please enter a password! \n";
	}

    if( empty($email)){
      $errors[] = "Please enter a email! \n";
    }

    if(count($errors) == 0){
        $query = "SELECT * FROM accounts WHERE username = '$username'";
        $result = mysqli_query($link, $query);
        $num_rows = mysqli_affected_rows($link);
        
        if($result && $num_rows > 0){
            
            echo "Account with username: " . $username . " already exists!";
        }
        else{

            echo "no errors";
            $insert_query = "INSERT INTO accounts SET username = '$username', password = '$password', email = '$email'";
            $insert_result = mysqli_query($link, $insert_query);
            $insert_num_rows = mysqli_affected_rows($link);
            
            if($insert_result && $insert_num_rows > 0){
              $msg = $_POST['username'] . " : You have sucessfully registered!";
            }
        }
    }
?>