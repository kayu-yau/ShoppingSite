function changeQuantity(itemId, change, availableStock) {
    let quantityElement = document.getElementById(`quantity-${itemId}`);
    let currentQuantity = parseInt(quantityElement.innerText);

    // Calculate new quantity
    let newQuantity = currentQuantity + change;

    // Check if new quantity is greater than available stock
    if (newQuantity > availableStock) {
        alert("在庫が足りません。");
        return;
    }

    // Update the quantity display
    document.getElementById(`quantity-${itemId}`).innerText = newQuantity;

    // Delete the item if new quantity is zero or below
    if (newQuantity <= 0) {
        deleteCartItem(itemId);
    } else {
        // Proceed to update the cart with the new quantity
        updateCart(itemId, newQuantity);
    }
}

function deleteCartItem(itemId) {
    let url = `/delete_cart_item/${itemId}/`;

    fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
    })
        .then(res => {
            if (res.ok) {
                return res.json();  // Parse the JSON response
            } else {
                throw new Error("Error deleting item");
            }
        })
        .then(data => {
            // Remove the item from the DOM
            document.querySelector(`.item[data-id='${itemId}']`).remove();

            // Update the total price and number of items displayed
            document.getElementById("total-price").innerText = data.new_total_price;
            document.getElementById("num_of_items").innerText = data.num_of_items;

            // Check if there are any items left in the cart
            let items = document.querySelectorAll('.item');
            if (items.length === 0) {
                showEmptyCartMessage();
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function showEmptyCartMessage() {
    const itemContainer = document.querySelector('.itemContainer');
    itemContainer.innerHTML = '<div class="empty-cart-message"><p>カートにアイテムがありません。商品を追加してください。</p></div>';
}

function updateCart(itemId, quantity) {
    let url = "/update_cart/";  // Ensure this URL ends with a trailing slash

    let data = { id: itemId, quantity: quantity };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            // Update the total price if returned by the server
            document.getElementById("total-price").innerHTML = "￥" + data.new_total_price;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

let cart_total = parseFloat("{{cart.total_price}}");
let cart_id = "{{cart.id}}";

function makePayment() {
    console.log("Cart Total:", cart_total); // Debugging line

    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-PUBLIC KEY",
        tx_ref: "titanic-48981487343MDI0NzMx",
        amount: cart_total,
        currency: "JPY",
        payment_options: "card, mobilemoneyghana, ussd",
        redirect_url: "http://127.0.0.1:8000/confirm_payment/" + cart_id,
        meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
            email: "example@shoppingsite.com",
            phone_number: "08102909304",
            name: "{{request.user.username}}",
        },
        customizations: {
            title: "Shopping Site",
            description: "Buy with ease",
            logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
        },
    });
}
