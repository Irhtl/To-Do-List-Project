window.setTheme = function(isDark){
    console.log("setTheme اجرا شد:", isDark);

    document.body.classList.toggle("dark-mode", isDark);

    console.log(document.body.className);

    localStorage.setItem("darkMode", isDark);

    // تغییر آیکون (اگر در صفحه وجود داشته باشد)
    const icon = document.querySelector(".theme-button i");

    if(icon){

        icon.className = isDark
            ? "fas fa-sun"
            : "fas fa-moon";

    }

    // اگر صفحه داشبورد باشد، رندر مجدد انجام شود
   

};

window.toggleTheme = function(){

    const isDark = !(localStorage.getItem("darkMode") === "true");

    window.setTheme(isDark);

};

window.loadTheme = function(){

    const isDark = (localStorage.getItem("darkMode") === "true");

    window.setTheme(isDark);

};