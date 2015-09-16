<?php

// Initialize everything I'll need for the page
// Include any PHP function libraries or classes
include("../../../webinator_db_conn.inc.php"); // had to use absolute path

// DB globals for connection
$host = $GLOBALS['db_host'];
$user = $GLOBALS['db_user'];
$pass = $GLOBALS['db_pass'];
$db = $GLOBALS['db_db'];

// include models
include("models/User.class.php");
include("models/Page.class.php");
include("models/Project.class.php");

// include controllers
include("controllers/UserController.php");
include("controllers/PageController.php");
include("controllers/ProjectController.php");


/*
 * json_error_msg: simple error message function that
 * returns JSON object to be handled in success function of ajax
 *
 * @params: $msg = message to be sent to client
 */
function json_error_msg($msg){
  return json_encode('{ "msg":"Error: ' . $msg . '", "success":"error" }');
}

/*
 * json_success_msg: simple success message function that
 * returns JSON object to be handled in success function of ajax
 *
 * @params: $msg = message to be sent to client
 */
function json_success_msg($msg){
  return json_encode('{ "msg":"Success: ' . $msg . '", "success":"success" }');
}

function json_success_data($msg, $data){
  return json_encode(
    array(
    "msg"=>"Success: $msg",
    "data"=>$data,
    "success"=>"success"
    )
  );
}

/*
 * sanitize: handles cleaning all data from form inputs from user
 */
function sanitize($input){
  $input = strip_tags($input);
  $input = htmlspecialchars($input);
  $input = trim($input);
  return $input;
}


?>
