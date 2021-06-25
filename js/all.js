const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector('.cartList');
const cartSummary = document.querySelector('.cartSummary');
const total = document.querySelector('.total');
const submit = document.querySelector('.orderInfo-btn');
const Name = document.querySelector('#customerName');
const phone = document.querySelector('#customerPhone');
const email = document.querySelector('#customerEmail');
const address = document.querySelector('#customerAddress');
const payment = document.querySelector('#tradeWay');
let productData = [];
let cartData = [];
let str = ``;

//產品列表原始畫面

function initial() {
    getProductList();
    getCartList();
}

initial();

//產品列表 
function getProductList() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
        .then(function(response) {
            productData = response.data.products;
            productData.forEach(function(item) {
                renderProductList(item);
            });
            productList.innerHTML = str;

        })
}

//產品列表種類篩選
productSelect.addEventListener('change', function(e) {
    selectProductList(e.target.value);

});
//產品列表篩選
function selectProductList(select) {
    str = ``;
    productData.forEach(function(item) {
        if (select == item.category) {
            renderProductList(item);
        } else if (select == '全部') {
            renderProductList(item);
        }
    });
    productList.innerHTML = str;
};
//產品項目累加
function renderProductList(item) {
    str += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}"></img>
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>`;
    return;
}


//購物車 加入
productList.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.target.getAttribute("class") !== "addCardBtn") {
        return;
    }
    let productID = e.target.getAttribute("data-id");
    let numCheck = 1;
    cartData.forEach((item) => {
        if (item.product.id == productID) {
            numCheck = item.quantity += 1
        }
    })
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`, {
            "data": {
                "productId": productID,
                "quantity": numCheck
            }
        })
        .then((response) => {
            alert('success!');
            getCartList()
        });
});
//購物車 刪除
cartList.addEventListener('click', (e) => {
        e.preventDefault();
        const deleteBtn = e.target.getAttribute("class");
        if (deleteBtn !== "material-icons") {
            return;
        }
        let deleteID = e.target.getAttribute("data-id")
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${deleteID}`)
            .then((response) => {
                alert('Deleted!');
                getCartList()
            })
    })
    //購物車 清空
cartSummary.addEventListener('click', (e) => {
        e.preventDefault();
        const clearBtn = e.target.getAttribute("class")
        if (clearBtn !== "discardAllBtn") {
            return;
        }
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
            .then((response) => {
                alert('Clear all!');
                getCartList()
            })
            .catch((response) => {
                alert('shopping cart empty!')
            })
    })
    //購物車 渲染與總金額
function getCartList() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
        .then(function(response) {
            cartData = response.data.carts;
            let strCart = ``;
            let totalPrice = 0;
            cartData.forEach(function(item) {
                totalPrice += (item.product.price * item.quantity);
                strCart += `<tr>
                <td>
                    <div class="cardItem-title">
                        <img src="${item.product.images}" alt="">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>NT$${(item.product.price)*item.quantity}</td>
                <td class="discardBtn">
                    <a href="#" class="material-icons" data-id="${item.id}">
                        clear
                    </a>
                </td>
                </tr>`
            })
            cartList.innerHTML = strCart;
            total.innerHTML = `NT$${ totalPrice}`;
        })
}

// 提交訂單//
submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (cartData == []) {
        alert('Please add items in shopping cart!');
        return;
    }

    if (Name.value == '' || phone.value == '' || email.value == '' || address.value == '') {

        alert('Please insert the right data!');
        return;
    }
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`, {
            "data": {
                "user": {
                    "name": Name.value,
                    "tel": phone.value,
                    "email": email.value,
                    "address": address.value,
                    "payment": payment.value
                }
            }
        })
        .then((response) => {
            alert('Order submitted!');
            getCartList();
            Name.value = '';
            phone.value = '';
            email.value = '';
            address.value = '';
        });


})



getProductList();
getCartList();