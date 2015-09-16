<?php
    $db = true;
    include "pg_start/page_start.php";
    
    function sanitize($link, $data){
        $data = trim($data);
        $data = htmlentities($data);
        $data = mysqli_real_escape_string($link, $data);
        return $data;
    }
    
    $page_name = sanitize($link, $_POST['pageName']);
    $project_name = sanitize($link, $_POST['projectName']);
    $account_id = sanitize($link, $_POST['accountId']);
    
    if( empty($page_name)){
      $errors[] = "Please enter a page name! \n";
    }
    
    if(count($errors) == 0){
        $query = "SELECT * FROM pages JOIN projects ON projectName = '$project_name' AND pageName = '$page_name'";
        $result = mysqli_query($link, $query);
        $num_rows = mysqli_affected_rows($link);
        
        if($result && $num_rows > 0){ 
            echo "Already exists!";
        }
        else{
            $project_name_query = "SELECT projectId from projects WHERE projectName = '$project_name' AND accountId = '$account_id'";
            $project_id_result = mysqli_query($link, $project_name_query);
            $project_name_num_rows = mysqli_affected_rows($link);

            if($project_id_result && $project_name_num_rows > 0){
                while($row = mysqli_fetch_assoc($project_id_result)){
                    $project_id = $row['projectId'];
                }

                $insert_query = "INSERT INTO pages (pageName, projectId) VALUES ('$page_name', '$project_id')";
                $insert_result = mysqli_query($link, $insert_query);
                $insert_num_rows = mysqli_affected_rows($link);
                $page_id = mysqli_insert_id($link);
            
                if($insert_result && $insert_num_rows > 0){
                    $project_results = array("pageName" => $page_name, "msg" => "Page Created Sucessfully", "projectId" => $project_id, "pageId" => $page_id);
                    echo json_encode($project_results);
                }
                else{
                    $project_results = array("pageName" => $page_name, "msg" => "Page NOT Created Sucessfully", "projectId" => $project_id);
                    echo json_encode($project_results); 
                }
            }
            else{
                echo "There was a problem with the query";
            }
        }
    }
?>