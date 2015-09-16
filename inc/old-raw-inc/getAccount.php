<?php
    $db = true;
    include "pg_start/page_start.php";

    $account_id = $_POST['accountId'];

    $query = "SELECT * FROM accounts WHERE accountId = '$account_id'";
    $result = mysqli_query($link, $query);
    $num_rows = mysqli_affected_rows($link);

    if($result && $num_rows > 0){
        $accountArray = array();
        while($row = mysqli_fetch_assoc($result)){
            $accountArray[] = $row;
        }
        echo json_encode($accountArray);
    }
    else{
        echo "error";
    }
?>