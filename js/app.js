const root = $('.root');
const message = $('.message')

var user= {};
var operations = [];
var categories = ['Все','Переводы','Покупки'];

$(document).ready(()=>{
    user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {
        isAuth:false,
        password:'0000',
        balance:0,
        filters:{
            category:0,
            type:0,
            period:0
        },
        categories:['Все','Переводы','Покупки']
    };

    categories = user.categories;

    operations = localStorage.getItem('opHistory') ? JSON.parse(localStorage.getItem('opHistory')) : [];

    message.hide();

    if (checkAuth()){
        renderMain();
    }
    else{
        renderLogin();
    }
})

renderLogin = () => {
    main =`
    <div class="container login-form out">
        <input type="password" id="login-password" class="in" placeholder="Пароль">
        <button onclick="loginAuth()" class="out">Войти</button>
    </div>
    `;
    root.html(main);
}

renderMain = () => {
    catList = '';
    categories.forEach((element, id) => {
        catList += `<option value="${id}">${element}</option>`;
    });

    statsList = renderHistory(true);

    main = `
        <main>
            <header>
                <span>Текущий баланс</span>
                <h2>1000 ₽</h2>
                <button onclick="renderAccount()">Настройки аккаунта</button>
            </header>
            <div class="container">
                <h4>Рекомендации</h4>
                <p>Советуем сократить расходы в категории <span id="recs-title">${categories[findMaxSumCategory(operations)[0]]}</span></p>
                <p>Вы потратили в ней <span id="recs-sum">${findMaxSumCategory(operations)[1]} ₽</span></p>
            </div>
            <div class="container">
                <button onclick="renderAddOperation()">Добавить операцию</button>
                <button onclick="renderAddCategory()">Добавить категорию</button>
            </div>
            <div class="stats">
                <div class="stats-filter">
                    <select id="filter-type" onchange="filterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Расходы</option>
                        <option value="2">Доходы</option>
                    </select>
                    Категория
                    <select id="filter-category" onchange="filterUpdate()">
                        ${catList}
                    </select>
                    Период
                    <select id="filter-period" onchange="filterUpdate()">
                        <option value="0">Все время</option>
                        <option value="1">Месяц</option>
                        <option value="2">Неделя</option>
                        <option value="3">День</option>
                    </select>
                </div>
                <div class="stats-history">
                    ${statsList}
                </div>
            </div>
        </main>
    `;
    root.html(main);
}

renderAddOperation = () => {
    main = `
    <div class="container">
        <button onclick="renderMain()">Назад</button>
        <div class="op-stats">
            <select id="op-type" required>
                <option value="1">Расходы</option>
                <option value="2">Доходы</option>
            </select>
            Категория
            <select id="op-category" required>
                <option value="1">Переводы</option>
                <option value="2">Покупки</option>
            </select>
            Дата
            <input type="date" id="op-date" required>

            Сумма
            <input type="number" id="op-sum" required>

            <button onclick="addOperation()">Добавить</button>
        </div>
    </div>
    `;
    root.html(main);
}

renderAddCategory = () => {
    main = `
    <div class="container">
        <button onclick="renderMain()">Назад</button>
        Новая категория
        <input type="text" id="new-category">
        <button onclick="addCategory()">Добавить</button>
    </div>
    `;
    root.html(main);
}

renderAccount = () => {
    main = `
    <div class="container">
            <button onclick="renderMain()">Назад</button>
            <h3>Настройки аккаунта</h3>
            <input type="password" id="change-password" placeholder="Изменить пароль">
            <button onclick="changePassword()">Изменить</button>

            Выйти из аккаунта
            <button onclick="logout()">Выйти</button>
        </div>
    `
    root.html(main);
}

renderHistory = (isReturn) => {
    newOperations = operations;
    filteredOps = filterOps(newOperations);
    
    statsList = '';
    filteredOps.forEach((element, id)=>{
        statsList += `<div class="card ${element.type==1 ? 'expenses' : 'incomes'}">
                        <span>${categories[element.category]}</span>
                        <span>${element.sum} ₽</span>
                    </div>`
    });

    if (isReturn){
        return statsList;
    }
    $('.stats-history').html(statsList);
}

filterOps = (data) => {
    return data.filter((element)=>{
        if (parseInt(element.category) !== parseInt(user.filters.category)){
            if (parseInt(user.filters.category) !== 0){
                return false;
            }
        }
        if (parseInt(element.type) !== parseInt(user.filters.type)){
            if (parseInt(user.filters.type) !== 0){
                return false;
            }
        }
        if (!checkPeriod(element.date, user.filters.period)){
            return false
        }
        return true;
    })
}

findMaxSumCategory = (data) => {
    let maxSum = 0;
    let maxSumCategory = "";
  
    for (let i = 0; i < data.length; i++) {
      let currentSum = parseInt(data[i].sum);
  
      if (currentSum > maxSum) {
        if (data[i].type == '1'){
            maxSum = currentSum;
            maxSumCategory = data[i].category;
        }
      }
    }

    if (maxSumCategory == ''){
        maxSumCategory = "0";
    }
  
    return [maxSumCategory, maxSum];
}

checkPeriod = (date, period) =>{
    inpDate = new Date(date);
    curDate = new Date();
    dayDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
    weekDate = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    monthDate = new Date(curDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    switch (period) {
        case '3':
            console.log(dayDate, inpDate, curDate)
            if(dayDate <= inpDate){
                return true;
            }
            return false;
        
        case '1':
            if(monthDate <= inpDate){
                return true;
            }
            return false;

        case '2':
            if(weekDate <= inpDate){
                return true;
            }
            return false;
    
        default:
            return true;
    }
}

filterUpdate = ()=>{
    user.filters.category = $('#filter-category').val();
    user.filters.type = $('#filter-type').val();
    user.filters.period = $('#filter-period').val();
    renderHistory();
}

addOperation = ()=>{
    operations.push({
        category:$('#op-category').val(),
        type:$('#op-type').val(),
        sum:$('#op-sum').val(),
        date:$('#op-date').val(),
    });
    console.log(operations);
}

addCategory = ()=>{
    if ($('#new-category').val() != ''){
        categories.push($('#new-category').val());
    }
}

logout = () => {
    loginAuth(true);
    renderLogin();
}

checkAuth = () => {
    if (user.isAuth){
        return true;
    }
    return false;
}

animateMessage = async (text, time = 1000) =>{
    message.html(text);
    message.show();
    setTimeout(() => {
        message.css('animation', `hideMsg ${0.25*1000*time} ease-in`)
    }, time*0.75);
    setTimeout(() => {
        message.hide();
    }, time*0.25);
}

loginAuth = (isLogout) => {
    if (isLogout){
        user.isAuth = false;
    }
    else{
        if ($('#login-password').val() == user.password){
            user.isAuth = true;
            renderMain();
        }
        else{
            animateMessage('Неправильный пароль', 5000)
        }
    }
}

changePassword = () => {
    user.password = $('#change-password').val();
}

clearAllData = () => {
    user=null;
    operations=null;
    localStorage.clear();
}

window.addEventListener("beforeunload", (e)=>{
    user.categories = categories;
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("opHistory", JSON.stringify(operations));
})