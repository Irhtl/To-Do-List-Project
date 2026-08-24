
        // رنگ‌ها
        const COLORS = {
            light: {
                background: '#F5F7FA',
                card: '#FFFFFF',
                text: '#2D3748',
                textSecondary: '#718096',
                border: '#E2E8F0',
                primary: '#4F46E5',
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                purple: '#8B5CF6',
                pink: '#EC4899',
                blue: '#3B82F6',
                green: '#10B981',
                yellow: '#F59E0B',
                orange: '#F97316',
            },
            dark: {
                background: '#1A202C',
                card: '#2D3748',
                text: '#F7FAFC',
                textSecondary: '#CBD5E0',
                border: '#4A5568',
                primary: '#6366F1',
                success: '#34D399',
                warning: '#FBBF24',
                danger: '#F87171',
                purple: '#A78BFA',
                pink: '#F472B6',
                blue: '#60A5FA',
                green: '#34D399',
                yellow: '#FBBF24',
                orange: '#FB923C',
            }
        };

        // وضعیت برنامه
        let state = {
            user: null,
            tasks: [],
            newTask: '',
            taskDescription: '',
            taskCategory: 'کار',
            priority: 'متوسط',
            dueDate: '',
            dueTime: '',
            filter: 'همه',
            darkMode: false,
            showDatePicker: false,
            showTimePicker: false,
            showMenu: false,
            loading: true,
            selectedDate: new Date(),
            timeHour: '12',
            timeMinute: '00',
            timeIsPM: false ,
            notifications: [],
            unreadNotifications: 0,
            notifiedTasks: []
        };

        // متغیرهای DOM
        let loadingEl, appEl, headerSubtitleEl, taskInputEl, addButtonEl, descriptionInputEl, 
            dateDisplayEl, timeDisplayEl, tasksContainerEl, emptyStateEl, guestWarningEl, 
            saveWarningEl, taskCountEl, menuOverlayEl, menuContainerEl, datePickerOverlayEl, 
            timePickerOverlayEl, selectedDateDisplayEl, hoursScrollEl, minutesScrollEl, 
            amButtonEl, pmButtonEl, categoryScrollEl, priorityContainerEl, filterScrollEl;

        // مقداردهی اولیه
        function init() {
            // گرفتن عناصر DOM
            loadingEl = document.getElementById('loading');
            appEl = document.getElementById('app');
            headerSubtitleEl = document.getElementById('headerSubtitle');
            taskInputEl = document.getElementById('taskInput');
            addButtonEl = document.getElementById('addButton');
            descriptionInputEl = document.getElementById('descriptionInput');
            dateDisplayEl = document.getElementById('dateDisplay');
            timeDisplayEl = document.getElementById('timeDisplay');
            tasksContainerEl = document.getElementById('tasksContainer');
            emptyStateEl = document.getElementById('emptyState');
            guestWarningEl = document.getElementById('guestWarning');
            saveWarningEl = document.getElementById('saveWarning');
            taskCountEl = document.getElementById('taskCount');
            menuOverlayEl = document.getElementById('menuOverlay');
            menuContainerEl = document.getElementById('menuContainer');
            datePickerOverlayEl = document.getElementById('datePickerOverlay');
            timePickerOverlayEl = document.getElementById('timePickerOverlay');
            selectedDateDisplayEl = document.getElementById('selectedDateDisplay');
            hoursScrollEl = document.getElementById('hoursScroll');
            minutesScrollEl = document.getElementById('minutesScroll');
            amButtonEl = document.getElementById('amButton');
            pmButtonEl = document.getElementById('pmButton');
            categoryScrollEl = document.querySelector('.category-scroll');
            priorityContainerEl = document.querySelector('.priority-container');
            filterScrollEl = document.querySelector('.filter-scroll');

            // بارگذاری داده‌ها
            loadUserData();
            
            // مخفی کردن صفحه بارگذاری
            setTimeout(() => {
                loadingEl.style.display = 'none';
                appEl.style.display = 'block';
                state.loading = false;
                render();
            }, 1000);
            
            // تنظیم رویدادها
            setupEventListeners();
        }

        // بارگذاری داده کاربر
        function loadUserData() {
            if (typeof isLoggedIn !== "undefined" && isLoggedIn) {
                state.user = {
                    name: currentUsername
                };
                loadTasks();
            } else { state.user = null;}
        }

        // بارگذاری کارهای کاربر
        function loadTasks() {

    fetch("actions/get_tasks.php")
        .then(response => response.json())
        .then(tasks => {

            state.tasks = tasks;

            render();

            window.checkNotifications();

        })
        .catch(error => {

            console.error(error);

        });

}

        // ذخیره کارهای کاربر
        function saveUserTasks(tasksArray) {
            if (!state.user) return;
            
            try {
                const userData = localStorage.getItem(`user_${state.user.email}`);
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    parsedData.tasks = tasksArray;
                    localStorage.setItem(`user_${state.user.email}`, JSON.stringify(parsedData));
                    
                    // به‌روزرسانی داده کاربر فعلی
                    const updatedUser = { ...state.user, tasks: tasksArray };
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    state.user = updatedUser;
                }
            } catch (error) {
                console.error('خطا در ذخیره کارها:', error);
            }
        }

        // تنظیم رویدادها
        function setupEventListeners() {
            // تغییرات در فیلد ورود کار
            taskInputEl.addEventListener('input', (e) => {
                state.newTask = e.target.value;
                addButtonEl.disabled = !state.newTask.trim();
            });
            
            // تغییرات در فیلد توضیحات
            descriptionInputEl.addEventListener('input', (e) => {
                state.taskDescription = e.target.value;
            });
        }

        // رندر کلی
        function render() {
            // به‌روزرسانی زیرعنوان هدر
            updateHeader();
            
            // رندر دسته‌بندی‌ها
            renderCategories();
            
            // رندر اولویت‌ها
            renderPriorities();
            
            // رندر فیلترها
            renderFilters();
            
            // رندر کارها
            renderTasks();
            
            // به‌روزرسانی نمایش ذخیره
            updateSaveWarning();
        }

        // به‌روزرسانی هدر
        function updateHeader() {
            const stats = getStats();
            headerSubtitleEl.textContent = 
                 `${currentUsername} • ${stats.active} کار فعال`;
        }

        // رندر دسته‌بندی‌ها
        function renderCategories() {
            const categories = ['کار', 'شخصی', 'خرید', 'سلامتی', 'آموزش', 'پروژه'];
            categoryScrollEl.innerHTML = '';
            
            categories.forEach(category => {
                const categoryColor = getCategoryColor(category);
                const categoryIcon = getCategoryIcon(category);
                
                const option = document.createElement('div');
                option.className = `category-option ${state.taskCategory === category ? 'active' : ''}`;
                option.style.borderColor = state.taskCategory === category ? categoryColor : '';
                option.style.backgroundColor = state.taskCategory === category ? categoryColor : '';
                option.style.color = state.taskCategory === category ? 'white' : '';
                
                option.innerHTML = `
                    <i class="fas fa-${categoryIcon}"></i>
                    <span>${category}</span>
                `;
                
                option.addEventListener('click', () => {
                    state.taskCategory = category;
                    renderCategories();
                });
                
                categoryScrollEl.appendChild(option);
            });
        }

        // رندر اولویت‌ها
        function renderPriorities() {
            const priorities = ['پایین', 'متوسط', 'بالا'];
            priorityContainerEl.innerHTML = '';
            
            priorities.forEach(priority => {
                const priorityColor = getPriorityColor(priority);
                
                const option = document.createElement('div');
                option.className = `priority-option ${state.priority === priority ? 'active' : ''}`;
                option.style.borderColor = state.priority === priority ? priorityColor : '';
                option.style.backgroundColor = state.priority === priority ? `${priorityColor}20` : '';
                
                option.innerHTML = `
                    <div class="priority-dot" style="background-color: ${priorityColor};"></div>
                    <span style="color: ${state.priority === priority ? priorityColor : 'inherit'}">${priority}</span>
                `;
                
                option.addEventListener('click', () => {
                    state.priority = priority;
                    renderPriorities();
                });
                
                priorityContainerEl.appendChild(option);
            });
        }

        // رندر فیلترها
        function renderFilters() {
            const filters = ['همه', 'فعال', 'تکمیل‌شده', 'امروز'];
            filterScrollEl.innerHTML = '';
            
            filters.forEach(filter => {
                const button = document.createElement('button');
                button.className = `filter-button ${state.filter === filter ? 'active' : ''}`;
                button.textContent = filter;
                button.dataset.filter = filter;
                
                button.addEventListener('click', () => {
                    state.filter = filter;
                    renderFilters();
                    renderTasks();
                });
                
                filterScrollEl.appendChild(button);
            });
        }

        // رندر کارها
        function renderTasks() {
            const filteredTasks = getFilteredTasks();
            const stats = getStats();
            
            taskCountEl.textContent = `${filteredTasks.length} کار پیدا شد`;
            
            if (filteredTasks.length === 0) {
                tasksContainerEl.innerHTML = '';
                emptyStateEl.style.display = 'flex';
                
                // به‌روزرسانی پیام حالت خالی
                const title = emptyStateEl.querySelector('.empty-state-title');
                const subtitle = emptyStateEl.querySelector('.empty-state-subtitle');
                
                if (state.filter === 'همه') {
                    title.textContent = 'هنوز کاری اضافه نکردید!';
                    subtitle.textContent = 'یک کار جدید اضافه کنید';
                } else if (state.filter === 'تکمیل‌شده') {
                    title.textContent = 'کاری تکمیل نشده!';
                    subtitle.textContent = 'کارهای خود را به اتمام برسانید';
                } else if (state.filter === 'امروز') {
                    title.textContent = 'کاری برای امروز ندارید!';
                    subtitle.textContent = 'کارهای امروز را برنامه‌ریزی کنید';
                } else {
                    title.textContent = 'هیچ کاری فعال نیست!';
                    subtitle.textContent = 'همه کارهایتان را انجام داده‌اید';
                }
            } else {
                emptyStateEl.style.display = 'none';
                
                // ایجاد HTML کارها
                let tasksHTML = '';
                
                filteredTasks.forEach(task => {
                    const categoryColor = getCategoryColor(task.category);
                    const categoryIcon = getCategoryIcon(task.category);
                    const priorityColor = getPriorityColor(task.priority);
                    
                    tasksHTML += `
                        <div class="task-item" data-id="${task.id}">
                            <div class="checkbox" onclick="window.toggleTaskCompletion('${task.id}')" style="color: ${task.isCompleted ? getCurrentColors().success : categoryColor}">
                                <i class="fas ${task.isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                            </div>
                            
                            <div class="task-content">
                                <div class="task-header">
                                    <div class="task-title ${task.isCompleted ? 'completed' : ''}">
                                        ${task.title}
                                    </div>
                                    <div class="category-badge" style="background-color: ${categoryColor}20; color: ${categoryColor}">
                                        <i class="fas fa-${categoryIcon}"></i>
                                        <span>${task.category}</span>
                                    </div>
                                </div>
                                
                                ${task.description ? `
                                    <div class="task-description">${task.description}</div>
                                ` : ''}
                                
                                <div class="task-footer">
                                    <div class="task-meta">
                                        <div class="meta-item">
                                            <div class="priority-dot-small" style="background-color: ${priorityColor}"></div>
                                            <span>${task.priority}</span>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-calendar"></i>
                                            <span>${formatDate(task.dueDate)}</span>
                                        </div>
                                        <div class="meta-item">
                                            <i class="fas fa-clock"></i>
                                            <span>${task.dueTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button class="delete-button" onclick="window.deleteTask('${task.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
                
                tasksContainerEl.innerHTML = tasksHTML;
            }
        }

        // به‌روزرسانی هشدار ذخیره
        function updateSaveWarning() {
            if (state.user) {
                saveWarningEl.style.display = 'none';
                guestWarningEl.style.display = 'none';
            } else {
                saveWarningEl.style.display = 'flex';
                guestWarningEl.style.display = 'flex';
            }
        }

        // دریافت رنگ دسته‌بندی
        function getCategoryColor(category) {
            const colors = getCurrentColors();
            const categoryColors = {
                'کار': colors.purple,
                'شخصی': colors.pink,
                'خرید': colors.blue,
                'سلامتی': colors.green,
                'آموزش': colors.yellow,
                'پروژه': colors.orange,
            };
            return categoryColors[category] || colors.primary;
        }

        // دریافت آیکون دسته‌بندی
        function getCategoryIcon(category) {
            const icons = {
                'کار': 'briefcase',
                'شخصی': 'user',
                'خرید': 'shopping-cart',
                'سلامتی': 'heart',
                'آموزش': 'graduation-cap',
                'پروژه': 'clipboard-check',
            };
            return icons[category] || 'circle';
        }

        // دریافت رنگ اولویت
        function getPriorityColor(priority) {
            const colors = getCurrentColors();
            if (priority === 'بالا') return colors.danger;
            if (priority === 'متوسط') return colors.warning;
            return colors.success;
        }

        // دریافت رنگ‌های فعلی
        function getCurrentColors() {
            return state.darkMode ? COLORS.dark : COLORS.light;
        }

        // فرمت تاریخ
        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR');
        }

        // فیلتر کارها
        function getFilteredTasks() {
            return state.tasks.filter(task => {
                switch (state.filter) {
                    case 'فعال':
                        return !task.isCompleted;
                    case 'تکمیل‌شده':
                        return task.isCompleted;
                    case 'امروز':
                        const today = new Date().toISOString().split('T')[0];
                        return task.dueDate === today;
                    default:
                        return true;
                }
            });
        }

        // آمار
        function getStats() {
            return {
                total: state.tasks.length,
                completed: state.tasks.filter(t => t.isCompleted).length,
                active: state.tasks.filter(t => !t.isCompleted).length,
            };
        }

        // توابع عمومی

        // افزودن کار
        window.addTask = function() {
            if (!state.newTask.trim()) {
                alert('خطا: لطفا عنوان کار را وارد کنید');
                return;
            }

            const newTaskObj = {
                id: Date.now().toString(),
                title: state.newTask.trim(),
                description: state.taskDescription.trim(),
                category: state.taskCategory,
                priority: state.priority,
                isCompleted: false,
                dueDate: state.dueDate || new Date().toISOString().split('T')[0],
                dueTime: state.dueTime || '12:00',
                createdAt: new Date().toISOString(),
                userId: state.user ? state.user.id : 'guest',
            };

            if(!isLoggedIn){
                const updatedTasks =[newTaskObj, ...state.tasks];
                state.tasks = updatedTasks;
                render();

                return;
            }

            fetch("actions/add_task.php" , {
                method: "POST", headers:{
                    "Content-Type":
                    "application/x-www-form-urlencoded"
                },
                body:
                     "title=" +  encodeURIComponent(newTaskObj.title) + 
                     "&description=" +   encodeURIComponent(newTaskObj.description) +
                     "&category=" +  encodeURIComponent(newTaskObj.category) +
                     "&priority=" + encodeURIComponent(newTaskObj.priority) +
                     "&due_date=" + encodeURIComponent(newTaskObj.dueDate) +
                     "&due_time=" + encodeURIComponent(newTaskObj.dueTime)     })
                     .then(response =>
                        response.text())
                     .then(result => {
                        if(result.trim() === "success"){
                            alert("کار با موفقیت ذخیره شد");
                            location.reload();
                        }else if(result.trim() === "login_required"){
                            alert("ابتدا وارد حساب کاربری شوید");
                        }else{alert("خطا در ذخیره اطلاعات");
                        }
                     });
                     
            
            // ریست فرم
            state.newTask = '';
            state.taskDescription = '';
            state.taskCategory = 'کار';
            state.priority = 'متوسط';
            state.dueDate = '';
            state.dueTime = '';
            
            taskInputEl.value = '';
            descriptionInputEl.value = '';
            dateDisplayEl.textContent = 'انتخاب تاریخ';
            timeDisplayEl.textContent = 'انتخاب زمان';
            addButtonEl.disabled = true;
            
            // رندر مجدد
            renderCategories();
            renderPriorities();
            render();
            
            alert('موفقیت: کار جدید با موفقیت اضافه شد!');
        };

        // تغییر وضعیت تکمیل کار
        window.toggleTaskCompletion = function(id) {
            alert("toggleTaskCompletion اجرا شد");
            const task=state.tasks.find(t => t.id == id);
            if(!task) {
                alert("تسک پیدا نشد");
                return;
            }
            const completed = task.isCompleted ? 0 : 1 ;
            fetch("actions/toggle_task.php", {
                method: "POST" , headers: {
                "Content-Type":"application/x-www-form-urlencoded"
                },
                body: "id=" + encodeURIComponent(id) + "&completed=" + encodeURIComponent(completed)
             })
            .then(response=> response.text())
            .then(result => {
                alert("پاسح سرور: " + result);
                if (result.trim() === "success") {
                    task.isCompleted = (completed == 1);
                    renderTasks();
                }else{
                    alert("خطا در بروزرسانی وضع کار");
                }
                
            })
            .catch(error => {
                alert("خطای fetch:" + error);
            });
        };

        // حذف کار
        window.deleteTask = function(id) {
            if (!confirm('آیا مطمئنید که می‌خواهید این کار را حذف کنید؟')) {
                return;
            }
            fetch("actions/delete_task.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "id=" + encodeURIComponent(id)
            })
            .then(response => response.text())
            .then(result=>{
                alert("پاسخ سرور: " + result);
                if (result.trim() === "success") {
                    state.tasks = state.tasks.filter(task => task.id !=id);
                    render();
                }else{
                    alert("خظا در حذف کار");
                }
            })
            .catch(error =>{
                alert("خظای fetch: " + error);
            });
        };

        // باز کردن منو
        window.openMenu = function() {
            menuOverlayEl.style.display = 'block';
            setTimeout(() => {
                menuContainerEl.classList.add('show');
            }, 10);
            renderMenu();
        };

        // بستن منو
        window.closeMenu = function() {
            menuContainerEl.classList.remove('show');
            setTimeout(() => {
                menuOverlayEl.style.display = 'none';
            }, 300);
        };

        // رندر منو
        function renderMenu() {
            let menuHTML = '';
            
            if (state.user) {
                // منوی کاربر واردشده
                menuHTML = `
                    <div class="user-info">
                        <i class="fas fa-user-circle"></i>
                        <div class="user-name">${state.user.name}</div>
                        <div class="user-email">${state.user.email}</div>
                        <div class="user-stats">${state.user.tasks?.length || 0} کار ثبت شده</div>
                    </div>
                    
                    <a href="settings.php" class="menu-item">
    <i class="fas fa-cog"></i>
    <div class="menu-item-text">تنظیمات</div>
</a>
                        <div class="menu-item" onclick="window.openNotifications()">

    <i class="fas fa-bell"></i>

    <div class="menu-item-text">
        اعلان‌ها
    </div>

    <span
        id="notificationBadge"
        class="notification-badge"
        style="display:none">
    </span>

</div>
                       <div class="menu-item" onclick="window.openHelp()">

    <i class="fas fa-question-circle"></i>

    <div class="menu-item-text">
        راهنما
    </div>

</div>
                        
                      <div class="menu-item"
     onclick="window.toggleAbout()">

    <i class="fas fa-info-circle"></i>

    <div class="menu-item-text">
        درباره برنامه
    </div>

</div>

<div id="aboutContent"
     class="about-content">

    <div>Version 1.0.0</div>

    <div>© 2026 
    <br>All Rights Reserved</br></div>

</div>
                    
                    <button class="logout-button" onclick="window.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>خروج از حساب</span>
                    </button>
                `;
            } else {
                // منوی احراز هویت
                menuHTML = `
    <div class="user-info">
        <i class="fas fa-user-circle"></i>

        <div class="user-name">
            کاربر مهمان
        </div>

        <div class="user-email">
            برای ذخیره دائمی تسک‌ها وارد حساب شوید.
        </div>
    </div>

    <div class="menu-items">

        <a href="login.php" class="menu-item">
            <i class="fas fa-sign-in-alt"></i>
            <div class="menu-item-text">
                ورود
            </div>
        </a>

        <a href="register.php" class="menu-item">
            <i class="fas fa-user-plus"></i>
            <div class="menu-item-text">
                ثبت نام
            </div>
        </a>

        <div class="menu-item">
            <i class="fas fa-circle-info"></i>
            <div class="menu-item-text">
                درباره ما
            </div>
        </div>

    </div>
`;
            }
            
            menuContainerEl.innerHTML = menuHTML;
        }

        // تغییر حالت احراز هویت
        window.switchAuthMode = function() {
            const menuTitle = menuContainerEl.querySelector('.menu-title');
            const loginButton = menuContainerEl.querySelector('.menu-auth-button');
            const switchAuthText = menuContainerEl.querySelector('.switch-auth-text');
            const emailInput = menuContainerEl.querySelector('#menuEmail');
            const passwordInput = menuContainerEl.querySelector('#menuPassword');
            
            let isLogin = true;
            
            if (menuTitle.textContent === 'ورود به حساب') {
                // تغییر به ثبت‌نام
                menuTitle.textContent = 'ایجاد حساب';
                loginButton.textContent = 'ثبت‌نام';
                switchAuthText.textContent = 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید';
                
                // افزودن فیلد نام
                const nameHTML = `
                    <div class="input-container">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" class="menu-input" id="menuName" placeholder="نام و نام خانوادگی">
                    </div>
                `;
                emailInput.insertAdjacentHTML('beforebegin', nameHTML);
                
                // افزودن فیلد تأیید رمز عبور
                const confirmHTML = `
                    <div class="input-container">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" class="menu-input" id="menuConfirmPassword" placeholder="تکرار رمز عبور">
                    </div>
                `;
                passwordInput.insertAdjacentHTML('afterend', confirmHTML);
                
                isLogin = false;
            } else {
                // تغییر به ورود
                menuTitle.textContent = 'ورود به حساب';
                loginButton.textContent = 'ورود';
                switchAuthText.textContent = 'حساب کاربری ندارید؟ ثبت‌نام کنید';
                
                // حذف فیلدهای اضافی
                const nameInput = menuContainerEl.querySelector('#menuName');
                const confirmInput = menuContainerEl.querySelector('#menuConfirmPassword');
                if (nameInput) nameInput.parentElement.remove();
                if (confirmInput) confirmInput.parentElement.remove();
                
                isLogin = true;
            }
            
            // ذخیره حالت
            window.currentAuthMode = isLogin;
        };

        // مدیریت احراز هویت
        window.handleAuth = function() {
            const email = document.getElementById('menuEmail')?.value.trim();
            const password = document.getElementById('menuPassword')?.value.trim();
            
            if (!email || !password) {
                alert('خطا: لطفا ایمیل و رمز عبور را وارد کنید');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('خطا: لطفا یک ایمیل معتبر وارد کنید');
                return;
            }
            
            if (password.length < 6) {
                alert('خطا: رمز عبور باید حداقل ۶ کاراکتر باشد');
                return;
            }
            
            const isLogin = window.currentAuthMode !== false;
            
            if (!isLogin) {
                // ثبت‌نام
                const name = document.getElementById('menuName')?.value.trim();
                const confirmPassword = document.getElementById('menuConfirmPassword')?.value.trim();
                
                if (!name) {
                    alert('خطا: لطفا نام خود را وارد کنید');
                    return;
                }
                
                if (password !== confirmPassword) {
                    alert('خطا: رمز عبور و تأیید آن مطابقت ندارند');
                    return;
                }
                
                // بررسی وجود کاربر
                const existingUser = localStorage.getItem(`user_${email}`);
                if (existingUser) {
                    alert('خطا: این ایمیل قبلاً ثبت شده است');
                    return;
                }
                
                // ایجاد کاربر
                const userData = {
                    id: Date.now().toString(),
                    email,
                    password,
                    name,
                    createdAt: new Date().toISOString(),
                    tasks: []
                };
                
                localStorage.setItem(`user_${email}`, JSON.stringify(userData));
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                window.handleSignup(userData);
            } else {
                // ورود
                const user = localStorage.getItem(`user_${email}`);
                if (!user) {
                    alert('خطا: کاربری با این ایمیل وجود ندارد');
                    return;
                }
                
                const userData = JSON.parse(user);
                if (userData.password !== password) {
                    alert('خطا: رمز عبور اشتباه است');
                    return;
                }
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                window.handleLogin(userData);
            }
        };

        // ورود کاربر
        window.handleLogin = function(userData) {
            state.user = userData;
            state.tasks = userData.tasks || [];
            alert(`موفقیت: خوش آمدید ${userData.name}!`);
            window.closeMenu();
            render();
        };

        // ثبت‌نام کاربر
        window.handleSignup = function(userData) {
            state.user = userData;
            state.tasks = [];
            alert('موفقیت: حساب کاربری با موفقیت ایجاد شد!');
            window.closeMenu();
            render();
        };

        // خروج کاربر
        window.handleLogout = function() {
            if (confirm('آیا مطمئنید که می‌خواهید از حساب کاربری خارج شوید؟')) {
                localStorage.removeItem('currentUser');
                state.user = null;
                state.tasks = [];
                window.closeMenu();
                render();
            }
        };
        // مدیریت پیکر تاریخ
    window.openDatePicker = function(){

    $('#hiddenDatePicker').persianDatepicker('show');

};

        window.closeDatePicker = function() {
            datePickerOverlayEl.style.display = 'none';
        };

        window.confirmDate = function() {
            const dateStr = state.selectedDate.toISOString().split('T')[0];
            state.dueDate = dateStr;
            dateDisplayEl.textContent = formatDate(dateStr);
            window.closeDatePicker();
        };

        // مدیریت پیکر زمان
        window.openTimePicker = function() {
            timePickerOverlayEl.style.display = 'flex';
            
            // ایجاد ساعت‌ها
            let hoursHTML = '<div class="time-label">ساعت:</div>';
            for (let i = 1; i <= 12; i++) {
                const hour = i.toString().padStart(2, '0');
                hoursHTML += `<div class="time-option ${state.timeHour === hour ? 'selected' : ''}" onclick="window.selectHour('${hour}')">${hour}</div>`;
            }
            hoursScrollEl.innerHTML = hoursHTML;
            
            // ایجاد دقیقه‌ها
            let minutesHTML = '<div class="time-label">دقیقه:</div>';
            for (let i = 0; i < 60; i++) {
                const minute = i.toString().padStart(2, '0');
                minutesHTML += `<div class="time-option ${state.timeMinute === minute ? 'selected' : ''}" onclick="window.selectMinute('${minute}')">${minute}</div>`;
            }
            minutesScrollEl.innerHTML = minutesHTML;
            
            // به‌روزرسانی دکمه‌های ق.ظ/ب.ظ
            updateAmPmButtons();
        };

        window.closeTimePicker = function() {
            timePickerOverlayEl.style.display = 'none';
        };

        window.selectHour = function(hour) {
            state.timeHour = hour;
            window.openTimePicker(); // رندر مجدد
        };

        window.selectMinute = function(minute) {
            state.timeMinute = minute;
            window.openTimePicker(); // رندر مجدد
        };

        window.selectAmPm = function(isPM) {
            state.timeIsPM = isPM;
            updateAmPmButtons();
        };

        window.confirmTime = function() {
            console.log(
    state.timeHour,
    state.timeMinute,
    state.timeIsPM
);
            const hour24 = state.timeIsPM ? (parseInt(state.timeHour) + 12) : parseInt(state.timeHour);
            const timeString = `${hour24.toString().padStart(2, '0')}:${state.timeMinute}`;
            state.dueTime = timeString;
            timeDisplayEl.textContent = timeString;
            window.closeTimePicker();
        };

        function updateAmPmButtons() {
            if (state.timeIsPM) {
                amButtonEl.classList.remove('selected');
                pmButtonEl.classList.add('selected');
            } else {
                amButtonEl.classList.add('selected');
                pmButtonEl.classList.remove('selected');
            }
        }

        // شروع برنامه
        document.addEventListener('DOMContentLoaded', () => {
           window.loadTheme();
           $('#hiddenDatePicker').persianDatepicker({

    format: 'YYYY/MM/DD',

    initialValue: false,

    autoClose: true,

    observer: true,

    onSelect: function(unix){
       
        const pd = new persianDate(unix);
        
         console.log(pd);

        console.log(pd.format("YYYY/MM/DD"));
console.log(pd.toCalendar("persian").format("YYYY/MM/DD"));

        const g = pd.toCalendar('gregorian');

        state.selectedDate = new Date(
            g.year(),
            g.month()-1,
            g.date()
        );

        state.dueDate =
            state.selectedDate.toISOString().split('T')[0];

       document.getElementById("dateDisplayFa").textContent =
    pd.format("DD MMMM YYYY");

     document.getElementById("dateDisplayEn").textContent =
    `${g.year()}/${String(g.month()).padStart(2,'0')}/${String(g.date()).padStart(2,'0')}`;
    }

});
            init();

            window.requestNotificationPermission();
            
            window.requestNotificationPermission = async function () {

    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

};

            window.checkNotifications();

setInterval(function(){

    window.checkNotifications();

},30000);
        });

        window.showNotification = function(title,message){

             window.addNotification(title,message);
             const container =
        document.getElementById("notificationContainer");

             const card=document.createElement("div");

    card.className="notification";

    card.innerHTML=`

        <div class="notification-icon">

            <i class="fas fa-bell"></i>

        </div>

        <div class="notification-content">

            <div class="notification-title">

                ${title}

            </div>

            <div class="notification-text">

                ${message}

            </div>

        </div>

        <div class="notification-close">

            <i class="fas fa-times"></i>

        </div>

    `;

    container.appendChild(card);

    // اعلان سیستم (Browser Notification)
if ("Notification" in window &&
    Notification.permission === "granted") {

    new Notification(title, {
        body: message
        // بعداً می‌توانیم icon هم اضافه کنیم
        // icon: "assets/logo.png"
    });

}

    setTimeout(()=>{

        card.classList.add("show");

    },50);

    card.querySelector(".notification-close").onclick=function(){

        close();

    };

    function close(){

        card.classList.remove("show");

        setTimeout(()=>{

            card.remove();

        },350);

    }

    setTimeout(close,6000);

}

window.addNotification = function(title, message) {

    state.notifications.unshift({

        id: Date.now(),

        title: title,

        message: message,

        time: new Date().toLocaleTimeString("fa-IR"),

        date: new Date().toLocaleDateString("fa-IR"),

        read: false

    });

    state.unreadNotifications++;

    window.updateNotificationBadge();

}

window.updateNotificationBadge = function(){

    const badge =
        document.getElementById("notificationBadge");

    if(!badge) return;

    if(state.unreadNotifications>0){

        badge.style.display="flex";

        badge.textContent=
            state.unreadNotifications;

    }else{

        badge.style.display="none";

    }

}

window.checkNotifications = function(){

    const now = new Date();

    state.tasks.forEach(task=>{

        if(task.isCompleted) return;

        if(!task.dueDate || !task.dueTime) return;

        const parts = task.dueDate.split("-");
        console.log("dueTime =", task.dueTime);

const time = task.dueTime.split(":");

const taskDate = new Date(

    Number(parts[0]),

    Number(parts[1]) - 1,

    Number(parts[2]),

    Number(time[0]),

    Number(time[1]),

    Number(time[2])

);

        console.log(task.title);
        console.log(task.dueDate);
        console.log(task.dueTime);
        console.log(taskDate);
        console.log(now);

       const diff =
    Math.floor((taskDate - now) / 1000);
       
       console.log("اختلاف ثانیه:", diff);

        const key = task.id+"_15";

        if (diff <= 3600 && diff >= 0){

            if(state.notifiedTasks.includes(key)) return;

            state.notifiedTasks.push(key);

            window.showNotification(

                "🔔 یادآوری",

                `تا ۱۵ دقیقه دیگر باید "${task.title}" را انجام بدهی.`

            );

        }

        console.log(diff);

    });

}
setInterval(function(){

    window.checkNotifications();

},30000);

window.requestNotificationPermission = async function () {

    if (!("Notification" in window)) {
        console.log("مرورگر از Notification پشتیبانی نمی‌کند.");
        return;
    }

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

};
window.openNotifications=function(){

    const page=
        document.getElementById("notificationsPage");

    const list=
        document.getElementById("notificationsList");

    page.style.display="flex";

    let html="";

    if(state.notifications.length===0){

        html=`
            <div
            style="
            text-align:center;
            margin-top:60px;
            color:#888;">
                هنوز اعلانی وجود ندارد.
            </div>
        `;

    }else{

        state.notifications.forEach(n=>{

           html+=`

<div class="notification-item ${n.read ? "read" : "unread"}">

                <div class="notification-item-title">

                    ${n.title}

                </div>

                <div class="notification-item-message">

                    ${n.message}

                </div>

                <button

class="notification-delete"

onclick="window.deleteNotification(${n.id})">

<i class="fas fa-trash"></i>

</button>

                <div class="notification-item-time">

                    ${n.date} - ${n.time}

                </div>

            </div>

            `;

        });

    }

    list.innerHTML=html;

}
window.closeNotifications=function(){

    document.getElementById(
        "notificationsPage"
    ).style.display="none";


    state.notifications.forEach(n=>{

    n.read=true;

});

state.unreadNotifications=0;

window.updateNotificationBadge();

    state.unreadNotifications=0;

    window.updateNotificationBadge();

}
window.deleteNotification=function(id){

    state.notifications=

        state.notifications.filter(n=>n.id!==id);

    window.openNotifications();

}
window.openHelp=function(){

    document
    .getElementById("helpOverlay")
    .style.display="flex";

}

window.closeHelp=function(){

    document
    .getElementById("helpOverlay")
    .style.display="none";

}
window.toggleAbout = function(){

    const about =
        document.getElementById("aboutContent");

    if(!about) return;

    if(about.style.display==="block"){

        about.style.display="none";

    }else{

        about.style.display="block";

    }

}
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