const $category = document.querySelectorAll(`.category`);
const $goodsList = document.querySelectorAll(`.goods_list`);
const $goods = document.querySelectorAll(`.goods`);
const $infoContainer = document.querySelectorAll(`.info_container`);
const $buyBtn = document.querySelectorAll(`.info_buy_button`);
const $showEl = document.getElementsByClassName(`show`);

const form = document.querySelector(`form`);
const formName = document.getElementById(`name`);
const formQuantity = document.getElementById(`number`);
const formPost = document.getElementById(`post_office`);
const formDataEl = document.querySelector(`.form-data`);
const radioButtons = document.querySelectorAll('input[type="radio"]');
const formSelect = document.getElementById(`select`);
const $continueBtn = document.querySelector(`.continue_button`);
const $myOrdersBtn = document.querySelector(`.my_orders_button`);

const EMPTY_FIELD = `The field is empty`;
const INCORRECT_VALUE = `Incorrect value`;

function printError(element, errorMessage){
    if (errorMessage){
        form.elements[element].classList.add(`has-error`);
    } else {
        form.elements[element].classList.remove(`has-error`);
    }
    form.elements[element].nextElementSibling.textContent = errorMessage;
}

function deleteOrder(order){
    let orders = JSON.parse(localStorage.getItem("orders"));
    let dataId = order.getAttribute("data-id").toString();
    for (let i = 0; i < orders.length; i++){
      if (orders[i].includes(dataId)){
            orders.splice(i, 1);
            localStorage.setItem("orders", JSON.stringify(orders));
            order.remove();
        }
    }
}

if (window.localStorage.getItem("orders")){
    let localOrders = JSON.parse(window.localStorage.getItem(`orders`));
    formDataEl.innerHTML = `${localOrders.join('')}`;
    formDataEl.classList.add(`orders`);
} else {
    window.localStorage.setItem(`orders`, JSON.stringify([]));
}

function sendFormToHTML(){
    const order = document.createElement(`div`);
    const date = JSON.stringify(new Date());
    const dateReplace = date.replace(/"/g, '');
    order.setAttribute(`data-id`, `${dateReplace}`);
    const div = document.createElement(`div`);
    const deleteBtn = document.createElement(`button`);
    deleteBtn.classList.add('delete');
    deleteBtn.textContent = `Видалити`;

    for (const radioButton of radioButtons){
        let selectedItem;
        if(radioButton.checked){
            selectedItem = radioButton.value;
            div.textContent = `Оплата: ${selectedItem}`;
            order.append(div);
            break;
        }
    }

    for (let i = 0; i < 7; i++){
        const div = document.createElement(`div`);
        let formElementValue = form.elements[i].value;
        if (form.elements[i].type !== `radio`) {
            div.textContent = `${form.elements[i].name}: ${formElementValue}`;
            order.append(div);
            order.append(deleteBtn);
        }
    }
    formDataEl.append(order);
    formDataEl.classList.add(`show`);
    formDataEl.classList.add(`orders`);


    let orders = JSON.parse(localStorage.getItem("orders"));
    orders.push(order.outerHTML);
    localStorage.setItem(`orders`, JSON.stringify(orders));

    deleteBtn.addEventListener("click", () => {
        deleteOrder(order);
    });
}

for (let i = 0; i < $category.length; i++){
    $category[i].addEventListener('click', (event) => {

        if (event.target.tagName === `SPAN`) {
            let activeEl = document.querySelector(`.active`);
            if(activeEl){
                activeEl.classList.remove(`active`);
                for (let j = 0; j < $goodsList.length; j++) {
                    $goodsList[j].classList.remove(`show`);
                }
            }
            event.target.classList.add(`active`);
            $goodsList[i].classList.add(`show`);
        }
    });
}

for (let i = 0; i < $goods.length; i++){
    $goods[i].addEventListener('click', (event) => {

        if (event.target.tagName === `SPAN`) {
            let activeEl = document.querySelector(`.active`);
            if(activeEl){
                activeEl.classList.remove(`active`);
                for (let j = 0; j < $goods.length; j++) {
                    $infoContainer[j].classList.remove(`show`);
                }
            }

            event.target.classList.add(`active`);
            $infoContainer[i].classList.add(`show`);
        }
    });
}

for (let i = 0; i < $buyBtn.length; i++){
    $buyBtn[i].addEventListener('click', () => {
        alert(`Done!`);
        form.classList.add(`show`);
    });
}

form.addEventListener(`submit`, (e) => {
    e.preventDefault();
    let valid = true;

    for (let radioButton of radioButtons){
        valid = false;
        printError(`radio2`, INCORRECT_VALUE);
        if (radioButton.checked === true){
            valid = true;
            printError(`radio2`, ``);
            break;
        }
    }

    if (formName.value === ''){
        printError(`name`, EMPTY_FIELD);
        valid = false;
    }

    if(formQuantity.value === ''){
        printError(`number`, EMPTY_FIELD);
        valid = false;
    } else if (!Number(formQuantity.value) > 0){
        printError(`number`, INCORRECT_VALUE);
        valid = false;
    }

    if(formPost.value === ''){
        printError(`post_office`, EMPTY_FIELD);
        valid = false;
    } else if (!Number(formPost.value) > 0){
        printError(`post_office`, INCORRECT_VALUE);
        valid = false;
    }

    if (formSelect.value === ''){
        printError(`select`,INCORRECT_VALUE);
        valid = false;
    }

    if(valid === true){
        for(let l = 0; l < $showEl.length; l++){
            $showEl[l].classList.remove(`show`);
        }
        sendFormToHTML();
        $continueBtn.classList.add(`show`);
    }
});

formName.addEventListener(`input`, (e) => {
    if (e.target.value.length > 0){
        printError(`name`, ``);
    } else {
        printError(`name`, EMPTY_FIELD);
    }
})

formQuantity.addEventListener(`input`, (e) => {
    if (e.target.value.length > 0){
        printError(`number`, ``);
    }
})

formPost.addEventListener(`input`, (e) => {
    if (e.target.value.length > 0){
        printError(`post_office`, ``);
    }
})

for (let radioButton of radioButtons){
    radioButton.addEventListener(`change`, () => {
            printError(`radio2`, ``);
    })
}

formSelect.addEventListener(`input`, (e) => {
    if (e.target.value.length > 0){
        printError(`select`, ``);
    }
})

$continueBtn.addEventListener('click', () => {
    formDataEl.classList.remove(`show`);
});

$myOrdersBtn.addEventListener('click', () => {
    formDataEl.classList.add(`show`);
    let localOrders = JSON.parse(localStorage.getItem('orders'));
    if (localOrders) {
        formDataEl.innerHTML = localOrders.join('');

        let deleteButtons = document.getElementsByClassName('delete');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', () => {
                deleteOrder(deleteButtons[i].parentNode);
            });
        }
    }
});
