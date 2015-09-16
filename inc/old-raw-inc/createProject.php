<?php
    $db = true;
    include "pg_start/page_start.php";
    
    function sanitize($link, $data){
        $data = trim($data);
        $data = htmlentities($data);
        $data = mysqli_real_escape_string($link, $data);
        return $data;
    }
    

    $project_name = sanitize($link, $_POST['projectName']);
    $account_id = sanitize($link, $_POST['accountId']);
    
    if( empty($project_name)){
      $errors[] = "Please enter a project name! \n";
    }
    
    if(count($errors) == 0){
        $query = "SELECT * FROM projects WHERE accountId = '$account_id' AND projectName = '$project_name'";
        $result = mysqli_query($link, $query);
        $num_rows = mysqli_affected_rows($link);
        
        if($result && $num_rows > 0){
            
            echo "Project with name: " . $project_name . " already exists!";
        }
        else{
            
            $insert_query = "INSERT INTO projects SET accountId = '$account_id', projectName = '$project_name'";
            $insert_result = mysqli_query($link, $insert_query);
            $insert_num_rows = mysqli_affected_rows($link);
            $project_id = mysqli_insert_id($link);

            if($insert_result && $insert_num_rows > 0){
                $project_results = array("projectName" => $project_name, "msg" => "Project Created Sucessfully", "projectId" => $project_id);
                echo json_encode($project_results);
            }
            else{
                $project_results = array("projectName" => $project_name, "msg" => "Project NOT Created Sucessfully");
                echo json_encode($project_results); 
            }
        }
    }
?>