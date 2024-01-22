const root = $('.root');

const clearUser = {
    isAuth : false,
    password : '0000',
    lastPage : 'main',
    balance : 0
}

var dataHistory = [
    {
        sum:800,
        category:1,
        type:1,
        date:'22-01-2023'
    },
    {
        sum:200,
        category:2,
        type:1,
        date:'22-01-2024'
    }
]

filterData = {
    category:0,
    type:0,
    period:0
}

categories = ["Переводы","Покупки"];

checkPeriod = (periodNum, elem) => {
    var currentDate = new Date();
    var weekAgo = new Date(Date() - 7 * 24 * 60 * 60 * 1000);
    var monthAgo = new Date(Date() - 30 * 7 * 24 * 60 * 60 * 1000);
    var dayAgo = new Date(Date() - 24 * 60 * 60 * 1000);

    switch (periodNum) {
        case 1:
            if (Date(elem.date.split(".")) >= monthAgo && currentDate >= new Date(elem.date)){
                return true;
            }
            return false;

        case 2:
            if (Date(elem.date.split(".")) >= weekAgo && currentDate >= new Date(elem.date)){
                return true;
            }
            return false;

        case 2:
            if (Date(elem.date.split(".")) >= dayAgo && currentDate >= new Date(elem.date)){
                return true;
            }
            return false;
    
        default:
            return true;
    }
}

getFormattedPrice = (price) => {
    return price;
}

getHistorySum = (dataHistoryArr) => {
    sum = 0;
    dataHistoryArr.forEach(element => {
        sum+=parseInt(element['sum']);
    });
    return sum;
}

checkAuth = () => {
    try {
        isAuth = JSON.parse(localStorage.getItem('user'))['isAuth'];
        return isAuth;
    }
    catch{
        localStorage.setItem('user', JSON.stringify(clearUser));
        return false;
    }
};

loginAuth = () => {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData['password'] === $('#login-password').val()){
        userData['isAuth'] = true;
        renderMain();
    }
    localStorage.setItem('user', JSON.stringify(userData));
};

logoutAuth = () => {
    let userData = JSON.parse(localStorage.getItem('user'));
    userData['isAuth'] = false;
    localStorage.setItem('user', JSON.stringify(userData));
    renderLogin();
};

addOperation = () => {
    let category = $('#newhistory-category').val();
    let type = $('#newhistory-type').val();
    let sum = $('#newhistory-num').val();
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;
    
    dataHistory.push({
        sum:sum,
        category:category,
        type:type,
        date:formattedToday
    });
}

filterUpdate = () => {
    filterData['category'] = parseInt($('#stats-categories').val());
    filterData['type'] = parseInt($('#stats-type').val());
    filterData['period'] = $('#stats-period').val();

    // console.log(filterData.category);
    renderHistory();
}

renderHistory = (isReturn) => {
    historyCards = '';
    filteredHistory = dataHistory.filter((elem)=>{
        if (elem.category !== filterData.category && filterData.category !== 0){
            return false;
        }
        console.log(`elem ${elem.type}`);
        console.log(filterData.type);
        if (elem.type !== filterData.type){
            if (filterData.type !== 0){
                return false;
            }
        }
        if (!checkPeriod(filterData.period, elem)){
            return false;
        }
        return true;
    });

    filteredHistory.forEach(element => {
        historyCards+= `
        <div class="cat-btn">
            <span class="title">${categories[element['category']-1]}</span>
            <span class="sum">${getFormattedPrice(element['sum'])} ₽</span>
        </div>
        `
    });

    console.log(filteredHistory);
    console.log(historyCards);

    if (isReturn){
        return historyCards;
    }
    else{
        $('.historyStats').html(historyCards);
    }
}

renderMain = () => {
    historyCards = renderHistory(true);
    // filteredHistory = dataHistory.filter((elem)=>{
    //     if (elem.category !== filterData.category && filterData.category !== 0){
    //         return false;
    //     }
    //     if (elem.type !== filterData.type && filterData.type !== 0){
    //         return false;
    //     }
    //     if (!checkPeriod(filterData.period, elem)){
    //         return false;
    //     }
    //     return true;
    // });
    // console.log(filteredHistory);

    // filteredHistory.forEach(element => {
    //     historyCards+= `
    //     <div class="cat-btn">
    //         <span class="title">${categories[element['category']-1]}</span>
    //         <span class="sum">${getFormattedPrice(element['sum'])} ₽</span>
    //     </div>
    //     `
    // });

    // console.log(historyCards);

    main = `
    <div class="container">
        <header>
            <h4>Ваш текущий баланс:</h4>
            <h2>${JSON.parse(localStorage.getItem('user')).balance} ₽</h2>
        </header>
        <div class="account">
            <div class="change-password-container">
                <label for="new-password">Изменить пароль</label>
                <input type="text" name="new-password" id="new-password" placeholder="Новый пароль">
                <button id="change-password-btn">Обновить</button>
            </div>
            <button id="logout-btn" onclick="logoutAuth()">Выйти из аккаунта</button>
        </div>
        <div class="links">
            <button class="goRecommends">
                <p>Рекомендации по сокращению расходов</p>
            </button>
            <button onclick="renderAddOperation()">
                <p>Добавить новую операцию</p>
            </button>
        </div>
        <div class="filters">
            
        </div>
        <div class="stats">
            <div class="infoStats">
                <p>
                    <span>Категория</span>
                    <select name="stats-categories" id="stats-categories" onchange="filterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Переводы</option>
                        <option value="2">Покупки</option>
                    </select>
                </p>

                <span><select name="stats-type" id="stats-type" onchange="filterUpdate()">
                    <option value="0">все операции</option>
                    <option value="1">расходы</option>
                    <option value="2">доходы</option>
                </select> за 
                <select name="stats-period" id="stats-period" onchange="filterUpdate()">
                    <option value="0">все время</option>
                    <option value="1">месяц</option>
                    <option value="2">неделю</option>
                    <option value="3">день</option>
                </select>
                
                </span>
                
                <p><span>Операции на сумму</span>&nbsp;<span>${getHistorySum(dataHistory)} ₽</span></p>
            </div>
            <div class="historyStats">
                ${historyCards}
            </div>
        </div>
    </div>
    `;

    root.html(main);
};

renderLogin = () => {
    main = `
    <div class="container">
        <label for="login-password">Введите пароль для входа</label>
        <input type="password" name="login-password" id="login-password" placeholder="Пароль">
        <input type="submit" id="login-enter" value="Войти" onclick="loginAuth()">
    </div>
    `

    root.html(main);
};

renderAddOperation = () => {
    main = `
    <div class="container">
            <button onclick="renderMain()">Назад</button>
            <h2>Новая операция</h2>
            <label for="newhistory-category">Категория</label>
            <select name="newhistory-category" id="newhistory-category">
                <option value="1">Переводы</option>
                <option value="2">Покупки</option>
            </select>
            <label for="newhistory-type">Тип</label>
            <select name="newhistory-type" id="newhistory-type">
                <option value="1">Расходы</option>
                <option value="2">Доходы</option>
            </select>

            <label for=""></label>
            <input type="num" name="newhistory-num" id="newhistory-num" placeholder="Сумма">

            <button onclick="addOperation()">Добавить</button>
        </div>
    `
    root.html(main);
}

$(document).ready(() => {
    dataHistory = localStorage.getItem("dataHistory") === null ? [] : JSON.parse(localStorage.getItem("dataHistory"));
    filterData = localStorage.getItem("dataFilter") === null ? [] : JSON.parse(localStorage.getItem("dataFilter"));
    if (checkAuth()){
        renderMain();
    }
    else{
        renderLogin();
    }

});

$(document).on('beforeunload',()=>{
    alert();
    localStorage.setItem('dataHistory', JSON.stringify(dataHistory));
    localStorage.setItem('dataFilter', JSON.stringify(filterData));
});