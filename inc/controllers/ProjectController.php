<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:48 PM
 */

class ProjectController {

  public function createProject(){
    $project_name = sanitize($_POST['projectName']);
    $user_id = sanitize($_POST['userId']);
    $errors = array();

    if( empty($project_name)){
      $errors[] = "Please enter a project name! \n";
    }

    if(count($errors) == 0){
      $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      $stmt = $dbh->prepare("select * from projects where UserID = :userId and ProjectName = :projectName");
      $stmt->execute(array('userId'=>$user_id, "projectName"=>$project_name));


      if($stmt->rowCount()){
        echo "Project with name: " . $project_name . " already exists!";
      }
      else{
        $stmt = $dbh->prepare("insert into projects (UserID, ProjectName) values ( :userId, :projectName) ");
        $stmt->execute( array( 'userId'=>$user_id, "projectName"=>$project_name ) );

        $project_id = $dbh->lastInsertId();

        if($stmt->rowCount()){
          $project = array(
            "projectName" => $project_name,
            "projectId" => $project_id
          );
          echo json_success_data("Project Created Sucessfully", $project);
        }
        else{
          echo json_error_msg("Project NOT Created Sucessfully");
        }
      }
    }
  }

  public function deleteProject(){

  }

  public function getProject(){

  }

  public function getProjects(){
    $user_id = $_POST['userId'];

    $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from projects where userId = :userId");
    $stmt->execute(array('userId'=>$user_id));


    if($stmt->rowCount()){
      $pagesArray = array();
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $pagesArray[] = array(
          "projectName" => $row["ProjectName"],
          "projectId" => $row["ProjectID"]
        );
      }
      echo json_success_data("Successfully retrieved your projects", $pagesArray);
    }
    else{
      echo json_error_msg("You dont have any projects");
    }
  }

}