<?php
session_start();
if(!isset($_SESSION["user_id"])) {
    exit("login_required");
}
include("../config/database.php");
$id= $_POST["id"];
$stmt = $conn->prepare("delete from tasks where id= ? and user_id= ?");
$stmt->bind_param("ii",$id,$_SESSION["user_id"]);
if ($stmt->execute()){
    echo"success";
}else{
    echo"error";
}