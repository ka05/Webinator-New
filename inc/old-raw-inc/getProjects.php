<?php
    $db = true;
    include "pg_start/page_start.php";
    
    $account_id = $_POST['accountId'];

    $query = "SELECT * FROM projects WHERE accountId = '$account_id'";
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