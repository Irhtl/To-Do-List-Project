<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <title> ثبت نام </title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <h2> ثبت نام </h2>
        <form action="actions/register.php" method="POST">
        <input type="text" name="username" placeholder="نام کاربری " required>
        <input type="email" name="email" placeholder="ایمیل" required>
        <input type="password" name="password" placeholder=" رمز عبور " required>
        <input type="password" name="confirm_password" placeholder="تکرار رمز عبور " required>
        <button type="submit"> ثبت نام </button>
        </form>
        <p>
            <a href="index.php"> قبلا ثبت نام کرده اید؟ </a>
        </p>
    </div>
</body>
</html>