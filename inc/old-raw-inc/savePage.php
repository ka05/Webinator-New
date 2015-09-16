<?php
    $db = true;
    include "pg_start/page_start.php";
    
    function sanitize($link, $data){
        $data = trim($data);
        $data = htmlentities($data);
        $data = mysqli_real_escape_string($link, $data);
        return $data;
    }
    
    function clean_html($link, $data){
        $data = htmlentities($data);
        $data = mysqli_real_escape_string($link, $data);
        return $data;
    }

    $page_id = sanitize($link, $_POST['pageId']);
    $page_js = sanitize($link, $_POST['pageJS']);
    $page_content = clean_html($link, $_POST['pageContent']);

  
    $query = "SELECT * FROM pages WHERE pageId = '$page_id' AND pageContent = '$page_content'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);
    
    if($result && $num_rows > 0){ 
        // echo "Already exists!";
        // echo $_POST['pageContent'];
        echo $page_content;
    }
    else{
        $insert_query = "UPDATE pages SET pageContent = '$page_content', pageJS = '$page_js' WHERE pageId = '$page_id'";
        $insert_result = mysqli_query($link, $insert_query);
        $insert_num_rows = mysqli_affected_rows($link);

        if($insert_result && $insert_num_rows > 0){
            $page_results = array("msg" => "Page Saved Sucessfully", "pageId" => $page_id);
            echo json_encode($page_results);
        }
        else{
            $page_results = array("msg" => "Page NOT Saved Sucessfully", "pageId" => $page_id, "error" => mysqli_error($link));
            echo json_encode($page_results); 
        }
    }
?>