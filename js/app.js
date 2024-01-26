const root = $('.root');

$(document).ready(()=>{
    user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
        isAuth:false,
        password:'0000',
        filters:{
            type:'0',
            category:'0',
            period:'0'
        },
        categories:['Все категории'],
        operations:[]
    };
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
                    <h1></h1>
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
                            <option value="1">Расходы</option>
                            <option value="2">Доходы</option>
                        </select>
                        <input type="date" id="add-date">
                        <input type="number" id="add-sum" placeholder="Сумма">
                        <button onclick="addOperation()">Добавить</button>
                    </div>
                </div>
            </section>
            <section>
                <div class="filter">
                    <select id="filter-type" onchange="fiterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Расходы</option>
                        <option value="2">Доходы</option>
                    </select>
                    <select id="filter-category" onchange="fiterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">Расходы</option>
                        <option value="2">Доходы</option>
                    </select>
                    <select id="filter-period" onchange="fiterUpdate()">
                        <option value="0">Все</option>
                        <option value="1">День</option>
                        <option value="2">Неделя</option>
                        <option value="3">Месяц</option>
                    </select>
                </div>
                <div class="stats">
                    <div class="incomes">
                        <h4>Ваши доходы</h4>
                        <h2></h2>
                    </div>
                    <div class="expenses">
                        <h4>Ваши расходы</h4>
                        <h2></h2>
                    </div>
                </div>
            </section>
        </main>
    `)
};


renderLogin = ()=>{
    root.html()
}

window.addEventListener("beforeunload", ()=>{
    localStorage.setItem("user", JSON.stringify(users));
})