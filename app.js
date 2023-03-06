const cardElement = document.querySelector('.cards');

// set data in localStorage (note : data is separate file (data.js))
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products))
}
products = JSON.parse(localStorage.getItem('products')) || products

function updateProducts() {
    localStorage.setItem('products', JSON.stringify(products))
}

function getLocalStorageProducts() {
    return JSON.parse(localStorage.getItem('products'));
}

function getCartProducts() {
    return JSON.parse(localStorage.getItem('cart'));
}

function getCartProductsLength() {
    return getCartProducts() ? Object.keys(getCartProducts()).length : 0;
}
// display a single card 
function displayCard(product, displayQuickView) {
    return (
        `<div class="card" data-index=${product.id}>
                <div class="image">
                    <img src=${product.product_image} />
                </div>
                <div class="card-info">
                    <p class="product-name">${product.product_name} </p>
                    <span class="product-price">${product.product_price}$</span>
                </div>
                <div class="card-buttons">
                <button class='cartButton' onclick="addOrRemoveFromCart(${product.id})"> 
                ${
                    product.added_to_cart ? 'Remove from cart' : 'Add to cart'
                }
                </button>
                    <button type='button' onclick="displayQuickView(${product.id})" style="display:${displayQuickView}"> Quick view</button>
                    
                </div>
        </div>`
    )
}
// display products list 
function displayProducts(products) {
    cardElement.innerHTML = products.map(product => {
        return displayCard(product)
    }).join('')
}

// cart List 
const cartList = document.querySelector('.cartList');

function displayCartList() {
    if (cartList.style.display == 'block') {
        cartList.style = 'display:none;'
    } else {
        cartList.style = 'display:block;';
    }
}
// Cart indicator
const indicator = document.querySelector('.indicator');

function updateIndicator() {
    const productsLength = getCartProductsLength();
    indicator.textContent = productsLength || 0;
}

// add and remove from  Cart ;
function addOrRemoveFromCart(id) {
    let product = products[id];
    let cart = getCartProducts();

    if (cart) {
        if (JSON.parse(localStorage.getItem('cart'))[id]) {
            removeFromCart(id)
            return;
        }
        cart[id] = product;
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        const cartItem = {};
        cartItem[id] = product;
        localStorage.setItem('cart', {});
        localStorage.setItem('cart', JSON.stringify(cartItem));
    }
    products[id].added_to_cart = true;
    reRender()
}

// remove from cart
function removeFromCart(id) {
    const cartProducts = getCartProducts();
    delete cartProducts[id]
    localStorage.setItem('cart', JSON.stringify(cartProducts));
    products = getLocalStorageProducts();
    products[id].added_to_cart = false;
    reRender();
}

function displayItemsOnCartList() {
    let items = getCartProducts();
    const elem = document.createElement("div");
    cartList.innerHTML = '';
    if (!getCartProductsLength()) {
        console.log("No cart")
        elem.textContent = "No products in cart"
    } else {
        Object.keys(items).forEach(function(key) {
            let item = `
            <div class="item">
            <div class="image">
                <img src=${items[key]?.product_image} />
            </div>
            <div>
                <p class="product-name">${items[key]?.product_name} </p>
                <span class="product-price">${items[key]?.product_price} $</span>
                <button onclick="removeFromCart(${items[key]?.id});displayCartList()">Remove </button>
            </div>
        </div>
            `;
            elem.innerHTML += item
        });
    }
    cartList.appendChild(elem);
}
// update page information after a change 
function reRender() {
    updateProducts();
    updateIndicator();
    displayItemsOnCartList()
    displayProducts(getLocalStorageProducts());
}
// quick-view 
const overlay = document.querySelector('#overlay');
const quickView = document.querySelector('#quick-view')
overlay.onclick = () => overlay.style.display = 'none'

function displayQuickView(id) {
    console.log("clicks")
    overlay.style.display = 'block'
    quickView.innerHTML = displayCard(products[id], "none");
}

displayProducts(getLocalStorageProducts());
displayItemsOnCartList()
updateIndicator();