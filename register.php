<?php
include "../config/database.php";
$username= trim($_POST["username"]);
$email= trim($_POST["email"]);
$password= $_POST["password"];
$confirm_password= $_POST ["confirm_password"];

if (empty($username)|| empty($email) || empty($password) || empty($confirm_password)) {die("لطفا همه فیلد ها را پر کنید");}

if($password !=$confirm_password){die("رمز عبور و تکرار آن یکسان نیست");}

$sql = "select * from users where username=? or email=?";
$stmt= $conn->prepare($sql);
$stmt->bind_param("ss",$username,$email);
$stmt->execute();

$result= $stmt->get_result();

if ($result->num_rows>0){die("نام کاربری یا ایمیل قبلا ثبت شده است");}

$hashedPassword= password_hash($password,PASSWORD_DEFAULT);
$sql= "insert into users(username, email, password) values(?,?,?)";
$stmt= $conn->prepare($sql);
$stmt->bind_param("sss",$username,$email,$hashedPassword);

if ($stmt->execute()) {

    session_start();

    $_SESSION["user_id"] = $conn->insert_id;
    $_SESSION["username"] = $username;

    header("Location: ../dashboard.php");
    exit();

} else {

    echo "خطا در ثبت نام";

}
$stmt->close();
$conn->close();