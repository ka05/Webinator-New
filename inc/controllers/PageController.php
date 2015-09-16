<?php
/**
 * Created by PhpStorm.
 * User: Clay
 * Date: 5/14/2015
 * Time: 1:48 PM
 */

class PageController {

  public function createPage(){
    $page_name = sanitize( $_POST['pageName']);
    $project_name = sanitize( $_POST['projectName']);
    $user_id = sanitize( $_POST['userId']);
    $errors = array();
    $project_id ="#";
    if( empty($page_name)){
      $errors[] = "Please enter a page name! \n";
    }

    if(count($errors) == 0){
      $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
      $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      $stmt = $dbh->prepare("select * from pages join projects on ProjectName = :projectName and PageName = :pageName");
      $stmt->execute(array('projectName'=>$project_name, "pageName"=>$page_name));

      if($stmt->rowCount()){
        echo json_error_msg("Page with name: $page_name Already exists!");
      }
      else{
        $stmt = $dbh->prepare("select ProjectID from projects where ProjectName = :projectName and UserID = :userId");
        $stmt->execute(array('projectName'=>$project_name, "userId"=>$user_id));

        if($stmt->rowCount()){
          while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $project_id = $row['ProjectID'];
          }

          $stmt = $dbh->prepare("insert into pages (PageName, ProjectID) values (:pageName, :projectId) ");
          $stmt->execute(array('pageName'=>$page_name, "projectId"=>$project_id));

          $page_id = $dbh->lastInsertId();

          if($stmt->rowCount()){
            $project_results = array(
              "pageName" => $page_name,
              "projectId" => $project_id,
              "pageId" => $page_id
            );
            echo json_success_data("Page Created Successfully", $project_results);
          }
          else{
            echo json_error_msg("Page NOT Created Successfully");
          }
        }
        else{
          echo json_error_msg("There was a problem with the query");
        }
      }
    }
  }

  public function deletePage(){

  }

  public function getPage(){
    $project_id = $_POST['projectId'];
    $page_id = $_POST['pageId'];

    $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from pages where ProjectID = :projectId and PageID = :pageId");
    $stmt->execute(array('projectId'=>$project_id, "pageId"=>$page_id));

    if($stmt->rowCount()){
      $pagesArray = array();
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
//        $pagesArray[] = $row;
        $pagesArray[] = array(
          "pageName" => $row["PageName"],
          "projectId" => $row["ProjectID"],
          "pageId" => $row["PageID"],
          "pageContent" => $row["PageContent"],
          "pageJS" => $row["PageJS"]
        );
      }
      echo json_success_data("successfully retrieved page", $pagesArray);
    }
    else{
      echo json_error_msg("failed to retrieve page");
    }
  }

  public function getPages(){
    $project_id = $_POST['projectId'];

    $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from pages where ProjectID = :projectId");
    $stmt->execute(array('projectId'=>$project_id));

    if($stmt->rowCount()){
      $pagesArray = array();
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // $page_name = $row["pageName"];
        // $page_id = $row["pageId"];
        // $tmpArr = array('pageName' => $page_name, 'pageId' => $page_id);
//        $pagesArray[] = $row;
        $pagesArray[] = array(
          "pageName" => $row["PageName"],
          "projectId" => $row["ProjectID"],
          "pageId" => $row["PageID"],
          "pageContent" => $row["PageContent"],
          "pageJS" => $row["PageJS"]
        );
      }
      echo json_success_data("successfully retrieved pages for this project", $pagesArray);
    }
    else{
      echo json_error_msg("failed to retrieve pages for this project");
    }
  }

  public function savePage(){
    $page_id = sanitize( $_POST['pageId']);
    $page_js = htmlentities( $_POST['pageJS']);
    $page_content = htmlentities($_POST['pageContent']);

    $dbh = new PDO("mysql:host=" . $GLOBALS['db_host'] . ";dbname=" . $GLOBALS['db_db'], $GLOBALS['db_user'], $GLOBALS['db_pass']);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $dbh->prepare("select * from pages where PageID = :pageId and PageContent = :pageContent");
    $stmt->execute(array('pageId'=>$page_id, "pageContent"=>$page_content));

    if($stmt->rowCount()){
      // Already exists!
      echo json_error_msg("Already exists");
    }
    else{
      $stmt = $dbh->prepare("update pages set PageContent = :pageContent, PageJS = :pageJS where PageID = :pageId");
      $stmt->execute(array("pageContent"=>$page_content, "pageJS"=>$page_js, "pageId" => $page_id));

      if($stmt->rowCount()){
        echo json_success_msg("Page Saved Sucessfully");
      }
      else{
        echo json_error_msg("Page NOT Saved Sucessfully");
      }
    }
  }
}