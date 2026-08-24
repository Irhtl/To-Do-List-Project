<?php

session_start();

require_once "../config/database.php";

if (!isset($_SESSION["user_id"])) {
    exit("دسترسی غیرمجاز");
}

$userId = $_SESSION["user_id"];

$username = trim($_POST["username"]);
$email = trim($_POST["email"]);

$stmt = $conn->prepare("
UPDATE users
SET username = ?, email = ?
WHERE id = ?
");

$stmt->bind_param("ssi", $username, $email, $userId);

if($stmt->execute()){

    $_SESSION["username"] = $username;

    header("Location: ../settings.php?success=profile");

}else{

    echo "خطا در ذخیره اطلاعات";

}