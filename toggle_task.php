<?php
session_start();

if (!isset($_SESSION["user_id"])){
    exit("login_required");
}
include("../config/database.php");

$id= $_POST["id"];
$completed = $_POST["completed"];
$stmt= $conn->prepare("update tasks set completed= ? where id=? and user_id=?");
$stmt->bind_param("iii",$completed,$id,$_SESSION["user_id"]);

if($stmt->execute()){
    echo"success";
    }else{
        echo"error";
    }
?>