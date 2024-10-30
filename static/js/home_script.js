function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function addToCart(productId, currentQuantity, availableStock) {
    const quantityToAdd = currentQuantity + 1; // This calculates the new quantity if adding one

    console.log("quantityToAdd:" + quantityToAdd);

    // Check if the quantity to add exceeds available stock
    if (quantityToAdd > availableStock) {
        alert("在庫が足りません。");
        return;
    }

    let data = { id: productId, quantity: quantityToAdd }; // Include the new quantity

    fetch("/add_to_cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'X-CSRFToken': csrftoken },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("num_of_items").innerHTML = data.num_of_items;
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
}