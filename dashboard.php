<?php
session_start();

$isLoggedIn = isset($_SESSION["user_id"]);
$username = $isLoggedIn ? $_SESSION["username"]: "کاربر مهمان";
?>

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مدیریت کارها</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/persian-datepicker/dist/css/persian-datepicker.min.css">
</head>
<body>
    <!-- صفحه بارگذاری -->
    <div class="loading-container" id="loading">
        <div class="spinner"></div>
        <div class="loading-text">در حال بارگذاری...</div>
    </div>

    <!-- محتوای اصلی -->
    <div id="app" style="display: none;">
        <!-- هدر -->
        <header class="header">
            <div class="header-content">
                <button class="menu-button" onclick="window.openMenu()">
                    <i class="fas fa-bars"></i>
                </button>
                
                <div class="header-info">
                    <h1 class="header-title">📝 مدیریت کارها</h1>
                    <p class="header-subtitle" id="headerSubtitle">
                        <?=
                        htmlspecialchars($username)
                        ?> . کار فعال 
                    </p>
                </div>
                
                <button class="theme-button" onclick="window.toggleTheme()">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </header>

        <!-- محتوای اصلی -->
        <div class="container">
            <!-- فرم افزودن کار -->
            <section class="add-form">
                <h2 class="form-title">اضافه کردن کار جدید</h2>
                
                <div class="input-row">
                    <input type="text" class="task-input" id="taskInput" placeholder="عنوان کار را وارد کنید..." onkeypress="if(event.key === 'Enter') window.addTask()">
                    <button class="add-button" id="addButton" onclick="window.addTask()" disabled>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <textarea class="description-input" id="descriptionInput" placeholder="توضیحات (اختیاری)..."></textarea>
                
                <label class="label">دسته‌بندی:</label>
                <div class="category-scroll">
                    <!-- دسته‌بندی‌ها با اسکریپت اضافه می‌شوند -->
                </div>
                
                <label class="label">اولویت:</label>
                <div class="priority-container">
                    <!-- اولویت‌ها با اسکریپت اضافه می‌شوند -->
                </div>
                
                <div class="datetime-container">
                    <div class="datetime-column">
                        <label class="label">تاریخ:</label>
                        <button class="date-button" onclick="window.openDatePicker()">
                            <i class="fas fa-calendar"></i>
                            <div id="dateDisplay">

    <div id="dateDisplayFa">
        انتخاب تاریخ
    </div>

    <small id="dateDisplayEn"></small>

</div>
                        </button>
                    </div>
                    
                    <div class="datetime-column">
                        <label class="label">ساعت:</label>
                        <button class="date-button" onclick="window.openTimePicker()">
                            <i class="fas fa-clock"></i>
                            <span id="timeDisplay">انتخاب زمان</span>
                        </button>
                    </div>
                </div>
            </section>

            <!-- فیلترها -->
            <div class="filter-scroll">
                <!-- فیلترها با اسکریپت اضافه می‌شوند -->
            </div>

            <!-- لیست کارها -->
            <section class="task-list">
                <div class="list-header-row">
                    <div class="list-header" id="taskCount">0 کار پیدا شد</div>
                    <div class="save-warning" id="saveWarning" style="display: none;">
                        <i class="fas fa-cloud"></i>
                        <span>ذخیره موقت</span>
                    </div>
                </div>
                
                <div id="tasksContainer">
                    <!-- کارها اینجا نمایش داده می‌شوند -->
                </div>
                
                <div id="emptyState" class="empty-state">
                    <i class="fas fa-clipboard-text-outline"></i>
                    <h3 class="empty-state-title">هنوز کاری اضافه نکردید!</h3>
                    <p class="empty-state-subtitle">یک کار جدید اضافه کنید</p>
                    <div class="guest-warning" id="guestWarning" style="display: none;">
                        <i class="fas fa-exclamation-circle"></i>
                        <div class="guest-warning-text">برای ذخیره دائمی کارها، لطفاً وارد حساب کاربری شوید</div>
                    </div>
                </div>
            </section>
        </div>

        <!-- منوی کشویی -->
        <div class="menu-overlay" id="menuOverlay">
            <div class="menu-backdrop" onclick="window.closeMenu()"></div>
            <div class="menu-container" id="menuContainer">
                <!-- محتوای منو -->
            </div>
        </div>

        <!-- پیکر تاریخ -->
        <div class="picker-overlay" id="datePickerOverlay">
            <input type="text" id="hiddenDatePicker" style="display:none;">
            <div class="picker-container">
                <div class="picker-header">
                    <h3 class="picker-title">انتخاب تاریخ</h3>
                    <button class="picker-close" onclick="window.closeDatePicker()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="calendar">

    <div class="calendar-header">

        <button class="month-btn" onclick="window.prevMonth()">
            <i class="fas fa-chevron-right"></i>
        </button>

        <div class="calendar-title">

            <div id="jalaliMonth">
                تیر ۱۴۰۵
            </div>

            <small id="gregorianMonth">
                July 2026
            </small>

        </div>

        <button class="month-btn" onclick="window.nextMonth()">
            <i class="fas fa-chevron-left"></i>
        </button>

    </div>

    <div class="weekdays">

        <span>ش</span>
        <span>ی</span>
        <span>د</span>
        <span>س</span>
        <span>چ</span>
        <span>پ</span>
        <span>ج</span>

    </div>

    <div id="calendarDays" class="calendar-days">

    </div>

    <div class="selected-date">

        <div id="selectedJalali">

            انتخاب نشده

        </div>

        <small id="selectedGregorian">

        </small>

    </div>

</div>
                
                <div class="picker-buttons">
                    <button class="picker-button cancel-button" onclick="window.closeDatePicker()">لغو</button>
                    <button class="picker-button confirm-button" onclick="window.confirmDate()">تأیید</button>
                </div>
            </div>
        </div>

        <!-- پیکر زمان -->
        <div class="picker-overlay" id="timePickerOverlay">
            <div class="picker-container">
                <div class="picker-header">
                    <h3 class="picker-title">انتخاب زمان</h3>
                    <button class="picker-close" onclick="window.closeTimePicker()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="time-picker-content">
                    <div class="time-scroll" id="hoursScroll">
                        <div class="time-label">ساعت:</div>
                        <!-- ساعت‌ها اینجا اضافه می‌شوند -->
                    </div>
                    
                    <div class="time-scroll" id="minutesScroll">
                        <div class="time-label">دقیقه:</div>
                        <!-- دقیقه‌ها اینجا اضافه می‌شوند -->
                    </div>
                    
                    <div class="ampm-container">
                        <div class="ampm-button" onclick="window.selectAmPm(false)" id="amButton">ق.ظ</div>
                        <div class="ampm-button" onclick="window.selectAmPm(true)" id="pmButton">ب.ظ</div>
                    </div>
                </div>
                
                <div class="picker-buttons">
                    <button class="picker-button cancel-button" onclick="window.closeTimePicker()">لغو</button>
                    <button class="picker-button confirm-button" onclick="window.confirmTime()">تأیید</button>
                </div>
            </div>
        </div>
    </div>
    <div id="notificationContainer" class="notification-container"></div>
    <!-- صفحه اعلان ها -->
<div class="notifications-page" id="notificationsPage">

    <div class="notifications-header">

        <button class="back-button"
                onclick="window.closeNotifications()">

            <i class="fas fa-arrow-right"></i>

        </button>

        <div class="notifications-title">
            اعلان‌ها
        </div>

    </div>

    <div id="notificationsList"
         class="notifications-list">

    </div>

</div>
     <div class="help-overlay" id="helpOverlay">

    <div class="help-card">

        <div class="help-header">

            <div class="help-title">
                راهنما
            </div>

            <button
                class="help-close"
                onclick="window.closeHelp()">

                <i class="fas fa-times"></i>

            </button>

        </div>

        <div class="help-content">

            <p>👋 به برنامه مدیریت کارها خوش آمدید.</p>

            <p>➕ با دکمه + یک کار جدید اضافه کنید.</p>

            <p>✅ با لمس تیک، کار را تکمیل کنید.</p>

            <p>🗑 برای حذف روی آیکون سطل زباله بزنید.</p>

            <p>🔔 اعلان‌ها قبل از موعد انجام نمایش داده می‌شوند.</p>

            <p>⚙ از تنظیمات می‌توانید ظاهر برنامه را تغییر دهید.</p>

        </div>

    </div>

</div>
    <script>
        const isLoggedIn = <?=
        $isLoggedIn ? 'true' : 'false' ?>;
        const currentUsername = <?=
        json_encode($username) ?>;
    </script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/persian-date/dist/persian-date.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/persian-datepicker/dist/js/persian-datepicker.min.js"></script>

    <script src="js/theme.js"></script>
    <script src="js/script.js"></script>
    
</body>
</html>