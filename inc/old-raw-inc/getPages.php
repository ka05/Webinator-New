<?php
    $db = true;
    include "pg_start/page_start.php";
    
    $project_id = $_POST['projectId'];

    $query = "SELECT * FROM pages WHERE projectId = '$project_id'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);
    
    if($result && $num_rows > 0){
        $pagesArray = array();
        while($row = mysqli_fetch_assoc($result)){
            // $page_name = $row["pageName"]; 
            // $page_id = $row["pageId"];
            // $tmpArr = array('pageName' => $page_name, 'pageId' => $page_id);
            $pagesArray[] = $row;
        }
        echo json_encode($pagesArray);
    }
    else{
        echo mysqli_error($link);
    }

?>