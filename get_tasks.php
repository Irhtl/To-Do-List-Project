<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
session_start();
include("../config/database.php");

if (! isset($_SESSION["user_id"]))
    {
        echo json_encode([]);
        exit();
    }

$user_id= $_SESSION["user_id"];

$sql= "select * from tasks where user_id= ? order by created_at DESC";

$stmt= $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$tasks= [];

while($row = $result->fetch_assoc()){
    $tasks[]=["id"=>$row["id"],
    "title"=>$row["title"],
    "description"=>$row["description"],
    "category"=>$row["category"],
    "priority"=>$row["priority"],
    "isCompleted"=>($row["completed"] == 1 ),
    "dueDate"=>$row["due_date"],
    "dueTime"=>$row["due_time"]

    ];
}
header("Content-Type:application/json;charset=utf-8");
echo json_encode($tasks);