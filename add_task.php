<?php

session_start();
include("../config/database.php");

if (! isset($_SESSION["user_id"]))
    {
        echo "login_required";
        exit();
    }

$user_id = $_SESSION["user_id"];

$title = $_POST["title"];
$description = $_POST["description"];
$category = $_POST["category"];
$priority = $_POST["priority"];
$due_date = $_POST["due_date"];
$due_time = $_POST["due_time"];

$sql = "insert into tasks (user_id, title, description, category, priority, due_date, due_time)
        values(?,?,?,?,?,?,?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "issssss",
    $user_id,
    $title,
    $descreaption,
    $category,
    $priority,
    $due_date,
    $due_time
);

if ($stmt->execute()){
    echo "success";
} else {
    echo "error";
}

$stmt->close();
$conn->close();
?>