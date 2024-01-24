const root = $('.root');
const message = $('.message');

$(document).ready(()=>{
    user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {
        isAuth:false,
        password:'0000',
        filters:{

        },
        operations:[],
        categories:['Все']
    };

    login(true)

});

renderLogin = () => {
    main = `
    <div class="login-form container">
            <span>Вход</span>
            <input type="password" id="login-password">
            <button onclick="login('login')">Войти</button>
        </div>
    `
    root.html(main);
}

renderMain = () => {
    user.filters = {
        category:0,
        type:0,
        period:0
    }
    historyData = getFilteredOps(user.operations);
    
    historyCards = '';
    historyData.forEach(element => {
        historyCards+=`
            <div class="card">
                <span class="history-category">${user.categories[parseInt(element.category)]}</span>
                <span class="history-sum">${formatPrice(element.sum)} ₽</span>
            </div>
        `;
    });

    main = `
        <main>
            <section>
                <header>
                    <h3>Ваш текущий баланс</h3>
                    <h1>${formatPrice(getBalance())} ₽</h1>
                    <button onclick="renderAccount()">Настройки</button>
                </header>
                <div class="recs">
                    <p>Рекомендуем сократить расходы в категории ${user.categories[getMaxCategory()[0]]}</p>
                    <p>Вы потратили в ней ${getMaxCategory()[1]} ₽</p>
                </div>
                <div class="add-buttons">
                    <button onclick="renderAddCategory()">Добавить категорию</button>
                    <button onclick="renderAddOperation()">Добавить операцию</button>
                </div>
            </section>
            <section>
                <h2>История операций</h2>
                <div class="filters">
                    <select id="filter-type" onchange="filterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Расходы</option>
                        <option value="2">Доходы</option>
                    </select>
                    <select id="filter-category" onchange="filterUpdate()">
                        ${getCategories(true)}
                    </select>
                    <select id="filter-period" onchange="filterUpdate()">
                        <option value="0">Все время</option>
                        <option value="1">День</option>
                        <option value="2">Неделя</option>
                        <option value="2">Месяц</option>
                    </select>
                </div>
                <div class="history">
                    ${historyCards}
                </div>
            </section>
        </main>
    `
    root.html(main);
}

renderAddCategory = ()=>{
    main = `
        <div class="container small-container">
            <div class="return-container">
                <button onclick="renderMain()">Назад</button>
            </div>
        </div>
        <div class="content">
            <h2>Добавить категорию</h2>
            <input type="text" id="cat-new" placeholder="Новая категория">
            <button onclick="addCategory()">Добавить</button>
        </div>
    `
    root.html(main);
}

renderAddOperation = ()=>{
    main = `
        <div class="container small-container">
            <div class="return-container">
                <button onclick="renderMain()">Назад</button>
            </div>
        </div>
        <div class="content">
            <h2>Добавить операцию</h2>
            <select id="op-type">
                <option value="1">Расходы</option>
                <option value="2">Доходы</option>
            </select>
            <select id="op-category">
                ${getCategories()}
            </select>
            <input type="date" id="op-date">
            <input type="number" placeholder="Сумма операции" id="op-sum">
            <button onclick="addOperation()">Добавить</button>
        </div>
    `
    root.html(main);
}

renderAccount = ()=>{
    main = `
        <div class="container small-container">
            <div class="return-container">
                <button onclick="renderMain()">Назад</button>
            </div>
            <div class="content">
                <h2>Настройки</h2>
                <div>
                    <h3>Сменить пароль</h3>
                    <input type="number" id="new-password" placeholder="Новый пароль">
                    <button onclick="changePassword()">Изменить</button>
                </div>
                <div>
                    <button onclick="login('logout')">Выйти из аккаунта</button>
                </div>
                
            </div>
        </div>
    `
    root.html(main);
}

login = (param = false) => {
    message.hide();
    if (param == false){
        if (user.password != $('#login-password').val()){
            console.log($('#login-password').val());
            msg('Неправильный пароль');
        }
    }
    if(param == 'logout'){
        user.isAuth = false;
    }
    if (user.password == $('#login-password').val() || user.isAuth){
        user.isAuth = true;
        renderMain();
        if(param == 'login'){
          msg('Успешный вход')  
        }
    }
    else{
        
        renderLogin();
    }
}
msg = async (text)=>{
    message.html(text);
    message.show();
    setTimeout(() => {
        message.hide();
    }, 5000);
}

addCategory = ()=>{
    text = $('#cat-new').val();
    if (text !== ''){
        user.categories.push(text)
        msg('Добавлена категория');
    }
    else{msg('Пустая категория')}
}

addOperation = ()=>{
    user.operations.push({
        category:$('#op-category').val(),
        type:$('#op-type').val(),
        date:$('#op-date').val(),
        sum:$('#op-sum').val()
    });
    console.log(user);
    msg('Добавлена операция');
}

filterUpdate = ()=>{
    user.filters = {
        category:$('#filter-category').val(),
        type:$('#filter-type').val(),
        period:$('#filter-period').val()
    };

    historyData = getFilteredOps(user.operations);
    
    historyCards = '';
    historyData.forEach(element => {
        historyCards+=`
            <div class="card">
                <span class="history-category">${user.categories[parseInt(element.category)]}</span>
                <span class="history-sum">${formatPrice(element.sum)} ₽</span>
            </div>
        `;
    });

    $('.history').html(historyCards);
}

getFilteredOps = (data)=>{
    dataCopy = data;
    dataCopy.filter((elem)=>{
        if (parseInt(elem.category) !== parseInt(user.filters.category)){
            if(user.filters.category != '0'){
                return false;
            }
        }
        if (parseInt(elem.type) !== parseInt(user.filters.type)){
            if(user.filters.type != '0'){
                return false;
            }
        }
        inpDate = Date(elem.date);
        curDate = new Date ();
        dayDate = new Date (curDate.getTime() - 1000 * 60 * 60 * 24);
        weekDate = new Date (curDate.getTime() - 1000 * 60 * 60 * 24 * 7);
        monthDate = new Date (curDate.getTime() - 1000 * 60 * 60 * 24 * 30);
        switch (parseInt(user.filters.period)) {
            case 1:
                if (dayDate > inpDate){
                    return false;
                }

            case 2:
                if (weekDate > inpDate){
                    return false;
                }

            case 3:
                if (monthDate > inpDate){
                    return false;
                }
        
            default:
                return true;
        }
    });
    return dataCopy;
}

getCategories = (getZero = false)=>{
    catsList = '';
    user.categories.forEach((element, id) => {
        if (id > 0 || (getZero && id == 0)){
            catsList+=`<option value="${id}">${element}</option>`
        }
    });
    return catsList;
}

getMaxCategory = ()=>{
    max = 0;
    maxCategory = 0;
    user.operations.forEach((elem, id)=>{
        if (parseInt(elem.sum) > max){
            max = elem.sum;
            maxCategory = id;
        }
    })
    return [maxCategory, max];
}

changePassword = ()=>{
    if ($('#new-password').val() != ''){
        user.password = $('#new-password').val();
    }
    msg('Пароль обновлён');
}

getBalance = ()=>{
    return 1000;
}

formatPrice = (price)=>{
    return parseInt(price).toLocaleString('ru-RU');
}

window.addEventListener('beforeunload', (e)=>{
    localStorage.setItem('userData',JSON.stringify(user));
})