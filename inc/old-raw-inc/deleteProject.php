<?php
    $db = true;
    include "pg_start/page_start.php";

    $project_id = $_POST['projectId'];

    $query = "DELETE FROM projects WHERE projectId = '$project_id'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);
    
    if($result && $num_rows > 0){ 
        echo "Deleted project successfully!";
    }
    else{
        echo "There was a problem deleting this project!";
    }
?>