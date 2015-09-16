<?php
    $db = true;
    include "pg_start/page_start.php";

    $page_id = $_POST['pageId'];

    $query = "DELETE FROM pages WHERE pageId = '$page_id'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);
    
    if($result && $num_rows > 0){ 
        echo "Deleted page successfully!";
    }
    else{
        echo "There was a problem deleting this page!";
    }
?>