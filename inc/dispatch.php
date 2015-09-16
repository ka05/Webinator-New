<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:18 AM
 */

header('Content-Type: application/json');
include("page_start.php");

/*
 * dispatch.php
 *
 * Rather than including all my application code and logic
 * here i moved my functions to separate php classes and routed
 * to them using the switch() statement in this file
 */

// verifies that the action post variable is set and then choses
// which function to fire based on the POST['action'] value
if(isset($_POST['action'])){

  // instantiate classes to call functions from
  $UserController = new UserController();
  $ProjectController = new ProjectController();
  $PageController = new PageController();

  // handle which function to call
  switch($_POST['action']){
    // User Methods
    case "createUser":
      $UserController->createUser();
      break;
    case "deleteUser":
      $UserController->deleteUser();
      break;
    case "getUser":
      $UserController->getUser();
      break;
    case "checkLoggedIn":
      $UserController->checkLoggedIn();
      break;
    case "isAdmin":
      $UserController->isAdmin();
      break;
    case "login":
      $UserController->login();
      break;
    case "logout":
      $UserController->logout();
      break;
    // Project Methods
    case "createProject":
      $ProjectController->createProject();
      break;
    case "deleteProject":
      $ProjectController->deleteProject();
      break;
    case "getProject":
      $ProjectController->getProject();
      break;
    case "getProjects":
      $ProjectController->getProjects();
      break;
    // Page Methods
    case "createPage":
      $PageController->createPage();
      break;
    case "deletePage":
      $PageController->deletePage();
      break;
    case "getPage":
      $PageController->getPage();
      break;
    case "getPages":
      $PageController->getPages();
      break;
    case "savePage":
      $PageController->savePage();
      break;

  }
}
else{
  echo json_error_msg("Forgot Post['action'] in call" . $_POST['userFullName']);
}

?>