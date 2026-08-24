<?php

session_start();

include "../config/database.php";

$email=
trim($_POST["email"]);
$password=
$_POST["password"];

if (empty($email)||
empty($password)){
    die("لطفا همه فیلد ها را پر کنید");
   }
$sql="select * from users where email=?";

$stmt=
$conn->prepare($sql);
$stmt->bind_param("s",
$email);
$stmt->execute();

$result=
$stmt->get_result();

if ($result->num_rows == 1)
{
    $user=
    $result->fetch_assoc();
                            if (password_verify($password,$user["password"])){
                                $_SESSION["user_id"]=
                                $user["id"];
                                $_SESSION["username"]=
                                $user["username"];
                                header("location: ../dashboard.php");
                                exit();} 
                                        else { die("رمز عبور اشتباه است");
                                        } 
}
      else { die("کاربری با این ایمیل پیدا نشد");}
$stmt->close();
$conn->close();
?>