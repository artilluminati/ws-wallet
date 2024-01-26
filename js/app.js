const root = $('.root');
$('.message').hide();

$(document).ready(()=>{
    user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
        isAuth:false,
        password:'0000',
        categories:['Все категории'],
        operations:[]
    };
    filters ={
        type:'0',
        category:'0',
        period:'0'
    };
    console.log(user);
    if(user.isAuth){
        renderMain();
    }
    else{
        renderLogin();
    }
})

renderMain = ()=>{
    root.html(`
    <main>
            <section>
                <header>
                    <h3>Ваш баланс</h3>
                    <h1>${getSum(user.operations)} ₽</h1>
                    <button onclick="renderAccount()">Настройки</button>
                </header>
                <div>
                    
                </div>
                <div>
                    Рекомендации
                </div>
                <div>
                    <div>
                        <h3>Новая категория</h3>
                        <input type="text" id="new-category">
                        <button onclick="addCategory()">Добавить</button>
                    </div>
                    <div>
                        <h3>Новая операция</h3>
                        <select id="add-type">
                            <option value="1">Расходы</option>
                            <option value="2">Доходы</option>
                        </select>
                        <select id="add-category">
                            ${getCategories()}
                        </select>
                        <input type="date" id="add-date">
                        <input type="number" id="add-sum" placeholder="Сумма">
                        <button onclick="addOperation()">Добавить</button>
                    </div>
                </div>
            </section>
            <section>
                <div class="filter">
                    <select id="filter-type" onchange="filterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Расходы</option>
                        <option value="2">Доходы</option>
                    </select>
                    <select id="filter-category" onchange="filterUpdate()">
                        ${getCategories(true)}
                    </select>
                    <select id="filter-period" onchange="filterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">День</option>
                        <option value="2">Неделя</option>
                        <option value="3">Месяц</option>
                    </select>
                </div>
                <div class="stats">
                    <div class="incomes">
                        <h4>Ваши доходы</h4>
                        <h2 class="incomes-data"></h2>
                    </div>
                    <div class="expenses">
                        <h4>Ваши расходы</h4>
                        <h2 class="expenses-data"></h2>
                    </div>
                </div>
            </section>
        </main>
    `);
    renderStats(user.operations);
};


renderLogin = ()=>{
    root.html(`
    <main>
        <div class="login-form">
            <h2>Войти</h2>
            <input type="password" id="login">
            <button onclick="login()">Войти</button>
        </div>
    </main>
    `);
}

renderAccount = ()=>{
    root.html(`
        <main>
            <div class="account">
                <div><button onclick="renderMain()">Назад</button></div>
                <h2>Настройки</h2>
                <div>
                    <h4>Смена пароля</h4>
                    <input type="password" id="change-pass">
                    <button onclick="changePassword()">Изменить пароль</button>
                </div>
                <button onclick="logout()">Выйти из аккаунта</button>
            </div>
        </main>
    `);
}

login = ()=>{
    if ($('#login').val() != ''){
        console.log($('#login').val());
        if ($('#login').val() == user.password) {
            user.isAuth = true;
            renderMain();
            msg('Успешный вход');
        }
        else{
            msg('Неверный пароль');
        }
    }
}

filterUpdate = ()=>{
    filters.category = $('#filter-category').val();
    filters.type = $('#filter-type').val();
    filters.period = $('#filter-period').val();
    statsData = user.operations;
    curDate = new Date();
    console.log(curDate.getTime())
    dayDate = Date(curDate.getTime() - 1000 * 60 * 60 * 24);
    weekDate = Date(curDate.getTime() - 1000 * 60 * 60 * 24 * 7);
    monthDate = Date(curDate.getTime() - 1000 * 60 * 60 * 24 * 30);
    statsData = statsData.filter((e)=>{
            console.log(e.category, filters.category, Date(e.date), monthDate)
            if (parseInt(e.category) != parseInt(filters.category)){
                if(parseInt(filters.category) != 0){
                    console.log('cat')
                    return false;
                }
            };
            if (parseInt(e.type) != parseInt(filters.type)){
                if(parseInt(filters.type) != 0){
                    console.log('type')
                    return false;
                }
            }
            if (parseInt(e.type) != parseInt(filters.type)){
                if(parseInt(filters.type) != 0){
                    console.log('type')
                    return false;
                }
            }
            switch (parseInt(filters.period)) {
                case 1:
                    if (Date(e.date) < dayDate){
                        return false;
                    }
                    break;

                case 2:
                    if (Date(e.date) < weekDate){
                        return false;
                    }
                    break;
                case 3:
                    if (Date(e.date) < monthDate){
                        return false;
                    }
                    break;
            
                default:
                    return true;
                    break;
            }
            return true;
        });
    console.log(statsData);
    renderStats(statsData);
}

renderStats = (data)=>{
    $('.incomes-data').html(getSum(data, '2')+' ₽');
    $('.expenses-data').html(getSum(data, '1')+' ₽')
}

getCategories = (includeZero)=>{
    if (includeZero){
        catsList = '<option value="0">Все категории</option>';
    }
    else{
        catsList ='';
    }
    user.categories.forEach((e, id)=>{
        if (id > 0){
            catsList += `
        <option value="${id}">${user.categories[id]}</option>
        `
        };
    })
    return catsList;
}

msg = async (text)=>{
    $('.message').html(text);
    $('.message').show();
    setTimeout(()=>{
        $('.message').hide();
    }, 5000)
}

addOperation = ()=>{
    user.operations.push({
        category:$('#add-category').val(),
        type:$('#add-type').val(),
        date:$('#add-date').val(),
        sum:$('#add-sum').val(),
    });
    filterUpdate();
    msg('Добавлена операция')
}

addCategory = ()=>{
    user.categories.push($('#new-category').val());
    $('#filter-category').html(getCategories(true));
    $('#add-category').html(getCategories());
    msg('Добавлена категория')
}

getSum = (data = user.operations, type) =>{
    sum = 0;
    switch (parseInt(type)) {
        case 1:
            data.forEach(element => {
                if (parseInt(element.type) == 1) {sum+=parseInt(element.sum)}
            });
            break;

        case 2:
            data.forEach(element => {
                if (parseInt(element.type) == 2) {sum+=parseInt(element.sum)}
            });
            break;
    
        default:
            data.forEach(element => {
                if (parseInt(element.type) == 2) {sum+=parseInt(element.sum)};
                if (parseInt(element.type) == 1) {sum-=parseInt(element.sum)}
            });
            break;
    }
    return sum.toLocaleString('ru-RU');
}

changePassword = () =>{
    user.password = $('#change-pass').val();
    msg('Пароль изменен')
}

window.addEventListener("beforeunload", (e)=>{
    localStorage.setItem("user", JSON.stringify(user));
})