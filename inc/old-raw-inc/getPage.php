<?php
    $db = true;
    include "pg_start/page_start.php";
    
    $project_id = $_POST['projectId'];
    $page_id = $_POST['pageId'];

    $query = "SELECT * FROM pages WHERE projectId = '$project_id' AND pageId = '$page_id'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);
    
    if($result && $num_rows > 0){
        $pagesArray = array();
        while($row = mysqli_fetch_assoc($result)){
            $pagesArray[] = $row;
        }
        echo json_encode($pagesArray);
    }
    else{
        echo mysqli_error($link);
    }
?>