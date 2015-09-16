<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:47 PM
 */

class UserController {

  /*
     * createUser: creates an User in the users table
     * of the DB from POST data passed in from ajax
     */
  public function createUser(){

    // database vars
    $host = $GLOBALS['db_host'];
    $db = $GLOBALS['db_db'];
    $user = $GLOBALS['db_user'];
    $pass = $GLOBALS['db_pass'];

    // Form processing
    $user_email = sanitize($_POST['userEmail']);
    $username = sanitize($_POST['username']);
    $user_pass = sanitize($_POST['userPass']);
    $user_pass = sha1($user_pass);
    $errors = "Please fill in the following: ";

    if( empty($username)){
      $errors .= "username, ";
    }
    if( empty($user_pass)){
      $errors .= "password, ";
    }
    if( empty($user_email)){
      $errors .= "email, ";
    }

    if($errors == "Please fill in the following: "){
      $dbh = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      $stmt = $dbh->prepare("select * from users where Username = :username");
      $stmt->execute(array('username'=>$username));

      if($stmt->rowCount() > 0){
        echo json_error_msg("Account with username: $username already exists!");
      }
      else{
        // insert user
        $stmt = $dbh->prepare("insert into users (UserEmail, Username, UserPass) values (:userEmail, :username, :userPass)");
        $stmt->execute(array(
          'userEmail'=>$user_email,
          'username'=>$username,
          'userPass'=>$user_pass
        ));

        if($stmt->rowCount() > 0){
          echo json_success_msg($_POST['username'] . " : You have sucessfully registered!");
        }
        else{
          echo json_error_msg("There was an error inserting you into the database");
        }

      }
    }
    else{
      echo json_error_msg("Error: ". rtrim($errors, ","));
    }
  }

  public function deleteUser(){
    $userId = $_POST["userId"]; // userId from script
    // database vars
    $host = $GLOBALS['db_host'];
    $db = $GLOBALS['db_db'];
    $user = $GLOBALS['db_user'];
    $pass = $GLOBALS['db_pass'];

    $dbh = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("delete from users where UserID = :userId");
    $stmt->execute(array('userId'=>$userId));

    if($stmt->rowCount() > 0){
      echo json_success_msg("Account deleted!");
    }
    else{
      echo json_error_msg("Incorrect userID");
    }
  }

  public function getUser(){
    $user_id = $_POST['userId'];

    $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from users where UserID = :userId");
    $stmt->execute(array('userId'=>$user_id));

    if($stmt->rowCount()){
      $accountArray = array();
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
//        $accountArray[] = $row;
        $accountArray[] = array(
          "userEmail"=>$row['UserEmail'],
          "adminStatus"=>$row['UserAdminStatus'],
          "username"=>$row["Username"],
          "userId"=>$row["UserID"],
        );
      }
      echo json_success_data("Successfully retrieved your userInfo", $accountArray);
    }
    else{
      echo json_error_msg("Error retrieving user info" . $user_id);
    }
  }

  /**
   * checkLoggedIn: verifies that the user is logged in
   */
  public function checkLoggedIn(){
    $username = $_POST['username'];
    session_start();

    if($_SESSION["username"] == $username){

      echo json_success_data("Welcome $username! You are logged in!",
        array(
          "username"=>$username,
          "admin"=>$_SESSION['userAdminStatus']
        )
      );
    }
    else{
      echo json_error_msg("You must log in!");
    }
  }

  /**
   * isAdmin: verifies user is an admin
   * @return bool
   */
  public function isAdmin(){
    session_start();
    if($_SESSION["userAdminStatus"] == "true"){
      return true;
    }
    else{
      return false;
    }
  }

  /*
   * set_login_session: initializes session and stores userID for later use
   *
   * @params:
   *    $user_id = userID
   *    $user_admin_status = If user is an admin or not
   */
  private function set_login_session($user_id, $username, $user_admin_status){
    session_start();
    $_SESSION["userID"] = $user_id;
    $_SESSION["username"] = $username;
    $_SESSION['userAdminStatus'] = $user_admin_status;
  }

  /*
   * login: verifies username and password that user
   * entered and provides appropriate error handling
   * then logs the user in and calls "set_login_session()"
   *
   */
  public function login(){
    $host = $GLOBALS['db_host'];
    $db = $GLOBALS['db_db'];
    $user = $GLOBALS['db_user'];
    $pass = $GLOBALS['db_pass'];

    // Username and Password
    $username = $_POST['username'];
    $password = sha1($_POST['password']);

    $dbh = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from users where Username = :username");
    $stmt->execute(array('username'=>$username));

    // old way
    if($stmt->rowCount()) {
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        if ($row['UserPass'] == $password) {
          $result[] = array(
            "userEmail"=>$row['UserEmail'],
            "adminStatus"=>$row['UserAdminStatus'],
            "username"=>$row["Username"],
            "userId"=>$row["UserID"],
          );
          $this->set_login_session($row["UserID"], $row["Username"], $row['UserAdminStatus']);
          echo json_success_data("Welcome " . $username . "! You are logged in!", $result);
        } else {
          echo json_error_msg("Incorrect Password! Please Try Again!");
        }
      }
    }
    else{
      echo json_error_msg("please register!");
    }
  }

  public function logout(){
    session_start();
    unset($_SESSION);
    $_SESSION['userID'] = null;
    $_SESSION['userAdminStatus'] = null;
    session_destroy();
    echo json_success_msg("You have sucessfully been logged out!" . $_SESSION['userID']);
  }
  
}