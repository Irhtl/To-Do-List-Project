<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require_once "config/database.php";

$userId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT username, email FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();

$user = $stmt->get_result()->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

    <meta charset="UTF-8">

    <title>تنظیمات حساب کاربری</title>

    <link rel="stylesheet" href="css/style.css">

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

</head>

<body>

<div id="toast" class="toast"></div>
<div class="settings-page">

    <!-- منوی سمت راست -->
    <aside class="settings-sidebar">

       <div class="settings-title">

    <i id="backBtn" class="fas fa-arrow-right settings-back"></i>

    <h2>تنظیمات</h2>

</div>

        

           <ul>

<li class="menu-link" data-section="profile">
    <i class="fas fa-user"></i>
    اطلاعات حساب
</li>

<li class="menu-link" data-section="password">
    <i class="fas fa-lock"></i>
    تغییر رمز عبور
</li>

<li class="menu-link" data-section="appearance">
    <i class="fas fa-palette"></i>
    ظاهر برنامه
</li>



<li class="menu-link" data-section="logout">
    <i class="fas fa-right-from-bracket"></i>
    خروج
</li>

</ul>


    </aside>

    <!-- محتوای صفحه -->

    <main class="settings-content">

        <div id="settings-content">

</div>

    </main>

</div>
<script>

const userName = "<?php echo htmlspecialchars($user['username']); ?>";
const userEmail = "<?php echo htmlspecialchars($user['email']); ?>";

const content = document.getElementById("settings-content");

function loadSection(section){

    switch(section){

        case "profile":

    content.innerHTML = `
        <h1>اطلاعات حساب</h1>

        <div class="settings-card">

            <form action="actions/update_profile.php" method="POST">

                <label>نام کاربری</label>

                <input
                    type="text"
                    name="username"
                    value="${userName}"
                    required>

                <br><br>

                <label>ایمیل</label>

                <input
                    type="email"
                    name="email"
                    value="${userEmail}"
                    required>

                <br><br>

               <button
    type="submit"
    id="saveProfileBtn">
    ذخیره تغییرات
</button>
            </form>

        </div>
    `;

break;


        case "password":

            content.innerHTML = `
<h1>تغییر رمز عبور</h1>

<div class="settings-card">

<form action="actions/change_password.php" method="POST">

<label>رمز عبور فعلی</label>

<div class="password-field">

    <input
        type="password"
        id="current_password"
        name="current_password"
        required>

</div>

<br><br>

<label>رمز عبور جدید</label>

<div class="password-field">

    <input
    type="password"
    id="new_password"
    name="new_password"
    required>


</div>

<br><br>

<label>تکرار رمز عبور جدید</label>

<div class="password-field">

    <input
    type="password"
    id="confirm_password"
    name="confirm_password"
    required>


</div>

<br><br>

<button
type="submit"
id="changePasswordBtn">

ذخیره تغییرات

</button>

</form>

</div>
`;

        break;

        case "appearance":

          content.innerHTML = `

<h1>ظاهر برنامه</h1>

<div class="theme-grid">

    <div class="theme-card active" id="lightTheme">

        <i class="fas fa-sun"></i>

        <h3>تم روشن</h3>

        <p>ظاهر پیشفرض برنامه</p>

    </div>

    <div class="theme-card" id="darkTheme">

        <i class="fas fa-moon"></i>

        <h3>تم تیره</h3>

        <p>مناسب استفاده در شب</p>

    </div>

</div>

`;
     
initAppearance();

break;

case "logout":

    openLogoutModal();

    return;
    }

}

function initAppearance(){

    const light=document.getElementById("lightTheme");
    const dark=document.getElementById("darkTheme");

    if(!light || !dark) return;

    const isDark =
        localStorage.getItem("darkMode")==="true";

    light.classList.toggle("active",!isDark);
    dark.classList.toggle("active",isDark);

    light.onclick=function(){

        window.setTheme(false);

        light.classList.add("active");
        dark.classList.remove("active");

        showToast("تم روشن فعال شد.","success");

    };

    dark.onclick=function(){

        window.setTheme(true);

        dark.classList.add("active");
        light.classList.remove("active");

        showToast("تم تیره فعال شد.","success");

    };

}
function showToast(message,type="success"){

    const toast=document.getElementById("toast");

    toast.className="toast "+type;

    toast.innerHTML=message;

    setTimeout(()=>{

        toast.classList.add("show");

    },50);

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

loadSection("profile");

document.querySelectorAll(".menu-link").forEach(item=>{

    item.onclick=function(){

        document.querySelectorAll(".menu-link").forEach(item=>{

    item.onclick=function(){

        document.querySelectorAll(".menu-link").forEach(i=>i.classList.remove("active"));

        this.classList.add("active");

        loadSection(this.dataset.section);

    };

});

    }
    const params = new URLSearchParams(window.location.search);

if(params.get("success")=="profile"){

    showToast("اطلاعات حساب با موفقیت ذخیره شد.","success");

}

if(params.get("error")=="profile"){

    showToast("خطا در ذخیره اطلاعات.","error");

}
if(params.get("success")=="password"){

    showToast("رمز عبور با موفقیت تغییر کرد.","success");

}

if(params.get("error")=="password_match"){

    showToast("رمزهای جدید یکسان نیستند.","error");

}

if(params.get("error")=="wrong_password"){

    showToast("رمز عبور فعلی اشتباه است.","error");

}

if(params.get("error")=="weak_password"){

    showToast("رمز عبور باید حداقل ۸ کاراکتر باشد.","error");

}

if(params.get("error")=="password"){

    showToast("خطا در تغییر رمز عبور.","error");

}
});
document.addEventListener("submit", function(e){

    if(e.target.action.includes("update_profile.php")){

        const btn = document.getElementById("saveProfileBtn");

        btn.disabled = true;

        btn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            در حال ذخیره...
        `;

    }

});
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {

    if (document.referrer) {
        history.back();
    } else {
        window.location.href = "dashboard.php";
    }

});
function openLogoutModal(){

    document
        .getElementById("logoutOverlay")
        .style.display="flex";

}

function closeLogoutModal(){

    document
        .getElementById("logoutOverlay")
        .style.display="none";

}
</script>
<div class="logout-overlay" id="logoutOverlay">

    <div class="logout-modal">

        <div class="logout-icon">
            <i class="fas fa-sign-out-alt"></i>
        </div>

        <div class="logout-title">
            خروج از حساب
        </div>

        <div class="logout-text">

            آیا مطمئن هستید که می‌خواهید
            از حساب خود خارج شوید؟

        </div>

        <div class="logout-buttons">

            <button
                class="logout-cancel"
                onclick="closeLogoutModal()">

                انصراف

            </button>

            <button
                class="logout-confirm"
                onclick="window.location.href='logout.php'">


                خروج

            </button>

        </div>

    </div>

</div>



<script src="js/theme.js"></script>

</body>

</html>