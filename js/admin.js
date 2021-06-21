let orderData = [];
let strOrder = ``;
let status = "";
const orderList = document.querySelector('.js-orderList');
const deleteAll = document.querySelector('.discardAllBtn');

//初始化//
function init() {
    getOrderList();
}
init();

//後台畫面//
function getOrderList() {
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
            headers: {
                'authorization': token,
            }
        })
        .then((response) => {
            strOrder = ``;
            orderData = response.data.orders;
            orderData.forEach(item => {
                //訂單狀態//

                if (item.paid == true) { status = "已處理" } else if (item.paid == false) { status = "未處理" };

                //訂單品項//
                let strName = ``;
                item.products.forEach((itemName => {
                    strName += `<p>${itemName.title}x${itemName.quantity}</p>`
                }))

                //訂單日期//
                let time = new Date(item.createdAt * 1000);
                let strDate = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;

                //訂單列表//
                strOrder += `<tr>
            <td>${item.createdAt}</td>
            <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
            ${strName}
            </td>
            <td>${strDate}</td>
            <td>
            <a href="#" class="orderStatus" order-id=${item.id}>${status}</a>
            </td>
            <td>
            <input type="button" class="delSingleOrder-Btn" order-id=${item.id} value="刪除">
            </td>
            </tr>`
            });
            orderList.innerHTML = strOrder;
            renderC3();
        })
}

//刪除個別訂單//
orderList.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == 'delSingleOrder-Btn') {
        let id = e.target.getAttribute('order-id');
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${id}`, {
                headers: {
                    'authorization': token,
                }
            })
            .then((response) => {
                alert('The item has been deleted!');
                getOrderList();
            })
    }
})

//清除全部清單//
deleteAll.addEventListener('click', (e) => {
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
            headers: {
                'authorization': token,
            }
        })
        .then((response) => {
            alert('All deleted!');
            getOrderList();
        })

})

//修改訂單狀態//
orderList.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') == "orderStatus") {
        let orderID = e.target.getAttribute("order-id")
        let updatedStatus;
        if (status == "已處理") {
            updatedStatus = false;
        } else if (status == "未處理") { updatedStatus = true };
        axios.put(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`, {
                "data": {
                    "id": orderID,
                    "paid": updatedStatus
                }
            }, {
                headers: {
                    'authorization': token,
                }
            })
            .then((response) => {
                alert('Status updated!');
                getOrderList();
            })
    }
})

//圓餅圖//
function renderC3() {

    let total = {};
    orderData.forEach((item) => {
        item.products.forEach((productItem) => {
            if (total[productItem.category] == undefined) { total[productItem.category] = productItem.price * productItem.quantity } else {
                total[productItem.category] += productItem.price * productItem.quantity
            }
        })
    })

    //做出資料關聯//
    let categoryAry = Object.keys(total);
    let newData = [];
    categoryAry.forEach((item) => {
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
    })


    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData
        }
    });
}