<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود</title>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

<div class="login-container">

    <div class="login-icon">
       <i class="fas fa-user-circle"></i>
    </div>

    <h2>ورود به حساب کاربری</h2>

    <form action="actions/login.php" method="POST">

        <input
            type="email"
            name="email"
            placeholder="ایمیل"
            required
        >

        <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            required
        >

        <button type="submit">
            ورود
        </button>

    </form>

    <p>
        حساب ندارید؟
        <a href="register.php">ثبت نام</a>
    </p>

</div>

</body>
</html>