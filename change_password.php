<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

require_once "../config/database.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../login.php");
    exit();
}

$userId = $_SESSION["user_id"];

$currentPassword = trim($_POST["current_password"]);
$newPassword = trim($_POST["new_password"]);
$confirmPassword = trim($_POST["confirm_password"]);

// بررسی یکسان بودن رمزهای جدید
if ($newPassword !== $confirmPassword) {
    header("Location: ../settings.php?error=password_match");
    exit();
}

// گرفتن رمز فعلی از دیتابیس
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Location: ../settings.php?error=user_not_found");
    exit();
}

$user = $result->fetch_assoc();


// بررسی رمز فعلی
if (!password_verify($currentPassword, $user["password"])) {
    header("Location: ../settings.php?error=wrong_password");
    exit();
}

// هش کردن رمز جدید
$newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// ذخیره رمز جدید
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $newHashedPassword, $userId);

if ($stmt->execute()) {

    header("Location: ../settings.php?success=password");

} else {

    header("Location: ../settings.php?error=password");

}

exit();