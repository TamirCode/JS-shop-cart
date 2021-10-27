const prodDiv = document.querySelector(".products");
const cartDiv = document.querySelector(".cart");
const rfooter = document.querySelector(".rfooter");
const totalPriceElement = document.querySelector(".totalPriceElement");
const checkoutBtn = document.querySelector(".checkoutBtn");
const addToAllStocksBtn = document.querySelector(".addToAllStocksBtn");
const addProductBtn = document.querySelector(".addProductBtn");
const removeProductBtn = document.querySelector(".removeProductBtn");
const productPriceRowPopupMenu = document.querySelector("#productPriceRowPopupMenu");
const productStockRowPopupMenu = document.querySelector("#productStockRowPopupMenu");
const popupMenuTitleText = document.querySelector(".popupMenuTitleText");
const closePopupBtn = document.querySelector("#closePopupBtn");
const darkOverlay = document.querySelector(".darkOverlay");
const popupContainer = document.querySelector(".popupContainer");
const nameInput = document.querySelector("#nameInput");
const priceInput = document.querySelector("#priceInput");
const stockInput = document.querySelector("#stockInput");
const submit = document.querySelector("#submit");
const information = document.querySelector(".information");

const products = [
    { name: "Apples", price: 1, stock: 10 },
    { name: "Bananas", price: 2, stock: 7  },
    { name: "Oranges", price: 3, stock: 5  },
    { name: "Kiwis", price: 4, stock: 10  },
    { name: "Mangos", price: 1, stock: 10 },
    { name: "Strawberries", price: 2, stock: 7  },
    { name: "Onions", price: 3, stock: 5  },
];

let cart = [];

checkoutBtn.addEventListener("click", function() {
    cart = [];
    drawCartItems();
});

addToAllStocksBtn.addEventListener("click", function() {
    for (const product of products) {
        product.stock++;
        drawProducts();
    }
});

let popupMenuToggle = "closed";

function showPopupMenu() {
    information.innerHTML = "";
    nameInput.value = "";
    if (popupMenuToggle == "add product") {
        priceInput.value = "";
        stockInput.value = "";
        productPriceRowPopupMenu.style.display = "flex";
        productStockRowPopupMenu.style.display = "flex";
        popupContainer.style.minHeight = "250px";
        popupMenuTitleText.textContent = "Add Product"
        submit.innerHTML = "Add Product"
    } else if (popupMenuToggle == "remove product") {
        productPriceRowPopupMenu.style.display = "none";
        productStockRowPopupMenu.style.display = "none";
        popupContainer.style.minHeight = "200px";
        popupMenuTitleText.textContent = "Remove Product"
        submit.innerHTML = "Remove Product"
    } else {
        alert("critical error (0)")
    }
    darkOverlay.style.display = "grid";
};

addProductBtn.addEventListener("click", function() {
    popupMenuToggle = "add product";
    showPopupMenu();
});

removeProductBtn.addEventListener("click", function() {
    popupMenuToggle = "remove product";
    showPopupMenu();
});

closePopupBtn.addEventListener("click", closePopupMenu);

function closePopupMenu() {
    darkOverlay.style.display = "none";
    information.innerHTML = "";
    nameInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    popupMenuToggle = "closed";
};

nameInput.addEventListener("input", changeSubmitButtonText) // can use listener "blur" instead of "input" to make it so that its only when pressing away from the input

function changeSubmitButtonText() {
    if (checkNames(products, nameInput.value)) { // if the nameInput is an existing product:
        if (popupMenuToggle == "add product") {
            submit.innerHTML = "Edit Product"
        } else if (popupMenuToggle == "remove product") {
            submit.innerHTML = `<span class="green">Remove Product</span>`
        } else {
            alert("critical error (1))")
        }
    } else {
        if (popupMenuToggle == "add product") {
            submit.innerHTML = "Add Product"
        } else if (popupMenuToggle == "remove product") {
            submit.innerHTML = `Remove Product`
        } else {
            alert("critical error (2)")
        }
    }
};

// submit button inside popup menu to add/remove products
submit.addEventListener("click", submitBtnPressed);

function submitBtnPressed() {
    information.innerHTML = "";
    if (nameInput.value.trim() == "") {
        information.innerHTML = `<span class="red">Error: Product name is required.</span>`
        nameInput.focus();
    } else if (checkNames(products, nameInput.value)) { // if the nameInput is an existing product:
        // foundItem value has been changed by checkNames() function to return the index of the item name which was in products array.
        if (popupMenuToggle == "add product") { // nameinput was an existing product and menu is in add product mode. This means editting mode:
            if (priceInput.value.trim() == "" && stockInput.value.trim() == "") { // if priceInput AND stockInput are empty: 🟪
                information.innerHTML = `<span class="red">Error: Please fill in price or stock.</span>`
                priceInput.focus();
            } else {
                if (priceInput.value.trim() == "") {
                    if (!isNaN(stockInput.value.trim())) { // if stockInput string is a valid number:
                        information.innerHTML = `<span class="green">✔️ Changed stock of <span class="wordbreak">"${products[foundIndex].name}"</span> from ${products[foundIndex].stock} to ${stockInput.value}</span>`
                        products[foundIndex].stock = stockInput.value;
                        drawProducts()
                    } else {
                        information.innerHTML = `<span class="red">Error: Stock input is not a valid number.</span>`
                        stockInput.focus()
                    }
                } else {
                    if (!isNaN(priceInput.value.trim())) { // if priceInput string is a valid number:
                        if (stockInput.value.trim() == "") { // if stockInput is empty:
                            products[foundIndex].price = priceInput.value;
                            information.innerHTML = `<span class="green">✔️ Changed stock of <span class="wordbreak">"${products[foundIndex].name}"</span> from $${products[foundIndex].price} to $${priceInput.value}</span>`
                            drawProducts()
                        } else {
                            if (!isNaN(stockInput.value.trim())) { // if stockInput string is a valid number:
                                information.innerHTML = `<span class="green">✔️ Changed price of <span class="wordbreak">"${products[foundIndex].name}"</span> from $${products[foundIndex].price} to $${priceInput.value}</span>
                                <br>
                                <span class="green">✔️ Changed stock of <span class="wordbreak">"${products[foundIndex].name}"</span> from ${products[foundIndex].stock} to ${stockInput.value}</span>`
                                products[foundIndex].price = priceInput.value;
                                products[foundIndex].stock = stockInput.value;
                                drawProducts()
                            } else {
                                information.innerHTML = `<span class="red">Error: Stock input is not a valid number.</span>`
                                stockInput.focus()
                            }
                        }
                    } else {
                        information.innerHTML = `<span class="red">Error: Price input is not a valid number.</span>`
                        priceInput.focus();
                    }
                }
            }
        } else if (popupMenuToggle == "remove product") { // nameInput was an existing product and menu is in remove product mode.
            information.innerHTML = `<span class="green">✔️ Product <span class="wordbreak">"${nameInput.value}"</span> was removed successfully.</span>`
            products.splice(foundIndex, 1); // removes 1 element at index foundIndex from products array.
            drawProducts();
        } else {
            alert("critical error (4)")
        }
    } else if (popupMenuToggle == "add product") { // ADDING MODE (above is editting mode)
        if (priceInput.value.trim() == "") { // if priceInput is empty:
            information.innerHTML = `<span class="red">Error: Price input is required.</span>`
            priceInput.focus();
        } else if (isNaN(priceInput.value.trim())) { // if priceInput is an invalid number:
            information.innerHTML = `<span class="red">Error: Price input is not a valid number.</span>`
            priceInput.focus();
        } else if (stockInput.value.trim() == "") { // if stockInput is empty:
            information.innerHTML = `<span class="red">Error: Stock input is required.</span>`
            stockInput.focus();
        } else if (isNaN(stockInput.value.trim())) { // if stockInput is an invalid number:
            information.innerHTML = `<span class="red">Error: Stock input is not a valid number.</span>`
            priceInput.focus();
        } else {
            information.innerHTML = `<span class="green">✔️ Created new product:<br>      Name: <span class="wordbreak">"${nameInput.value}"</span><br>      Price: $${priceInput.value}<br>      Stock: x${stockInput.value}</span>`.replaceAll('   ', '\&nbsp;\&nbsp;\&nbsp;')
            products.push({
                name: nameInput.value,
                price: priceInput.value,
                stock: stockInput.value,
            })
            drawProducts();
        }
    } else if (popupMenuToggle == "remove product") {
        information.innerHTML = `<span class="red">Error: <span class="wordbreak">"${nameInput.value}"</span> is not an existing product.</span>`
    } else {
        alert("critical error (3)")
    }
    changeSubmitButtonText();
};

let foundIndex = ""
// returns true if personName is in the array which has name properties in it. Also gives the index it was found at.
function checkNames(array, personName) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name == personName) {
            foundIndex = i
            return true;
        }
    }
    return false
}

function drawCartItems() {
    console.log("♻️ drawing cart column ...")
    // clear the cart
    cartDiv.innerHTML = "";
    // clear total price
    totalPriceElement.innerHTML = "";
    let totalPrice = 0;
    
    for (let i = 0; i < cart.length; i++) {
        
        const cartWrapper = document.createElement("div");
        cartWrapper.classList.add("cart-wrapper");
        const cartDetails = document.createElement("h3");
        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.classList.add("delBtn")
        cartDetails.innerHTML = `${cart[i].name} <span class="blue">x${cart[i].qt}</span>`;
        
        let nameStamp = cart[i].name; // stamp the current index NAME into a local variable inside the event Listener to search for the new index position of the item Name
        
        delBtn.addEventListener("click", function (e) {
            let stampedName = nameStamp;
            checkNames(cart, stampedName); // look for the new index of item Name in cart and return its index in variable foundIndex
            
            if (cart[foundIndex].qt < 2) {
                // add item back to stock
                for (const product of products) {
                    if (cart[foundIndex].name == product.name) {
                        product.stock++
                        drawProducts();
                    }
                }
                cart.splice(foundIndex, 1);
                drawCartItems();
            } else if (cart[foundIndex].qt > 1) {
                cart[foundIndex].qt--
                drawCartItems();
                // add item back to stock
                for (const product of products) {
                    if (cart[foundIndex].name == product.name) {
                        product.stock++
                        drawProducts();
                    }
                }
            } else {
                console.error(`QT has failed the if ladder. Current value: ${cart[foundIndex].qt} Cart list: ${JSON.stringify(cart)}`)
            }
        })
        cartWrapper.appendChild(cartDetails);
        cartWrapper.appendChild(delBtn);
        cartDiv.appendChild(cartWrapper);
        totalPrice = totalPrice + (cart[i].price * cart[i].qt);
    }
    totalPriceElement.innerHTML = `Total Price: <span class="green">$${totalPrice}</span>`
};

function drawProducts() {
    // clear the products column
    prodDiv.innerHTML = "";
    for (const product of products) {
        // product is products[i]
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        const details = document.createElement("h3");
        details.innerHTML = `${product.name} <span class="green">$${product.price}</span>`;
        const stockInfo = document.createElement("h6");
        if (product.stock > 0) {
            stockInfo.innerHTML = `Stock: <span class="blue">${product.stock}</span>`;
        } else {
            stockInfo.innerHTML = `<span class="red">Out of stock!</span>`;
        }
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = `Add ${product.name} to Cart`;
        
        if (product.stock > 0) {
            addToCartBtn.addEventListener("click", function () {
                // The <array>.find(<function>) method returns the value of the first element in an array that returns true (using the function)
                const founditem = cart.find(function(e) {
                    // return true/false if there are duplicate items
                    // e is cart[i]
                    // foundItem is the cart[e] which has cart[e].name == products[i].name
                    return e.name == product.name 
                })
                // if founditem is not empty (true) then there was duplicate found
                // else if founditems is empty/undefined (false) then it will be the first of its kind added to the array.
                if (founditem) {
                    founditem.qt++
                } else {
                    cart.push({
                        name: product.name,
                        price: product.price,
                        qt: 1,
                    })
                }
                product.stock--;
                drawCartItems();
                drawProducts();
            });
        } else {
            addToCartBtn.style.backgroundColor = "grey";
            addToCartBtn.style.cursor = "unset";
        }
        wrapper.appendChild(details);
        wrapper.appendChild(stockInfo);
        wrapper.appendChild(addToCartBtn);
        prodDiv.appendChild(wrapper);
        resizeProductsGrid();
    }
};

document.addEventListener("keydown", function(e) {
    if (popupMenuToggle != "closed") { // if popup menu is open:
        if (e.keyCode == 13) { // if enter is pressed:
            console.log("enter pressed while popup menu is opened. Running submitBtnPressed()");
            submitBtnPressed();
        } else if (e.keyCode == 27) { // if escape key is pressed:
            console.log("escape pressed while popup menu is open. Running exit button");
            closePopupMenu();
        } else if (( e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 ) && popupMenuToggle == "add product") { // if arrow keys are pressed (left, up, right, down), and popup menu is on Add Product:
            console.log("arrow keys pressed");
            if (e.keyCode == 37 || e.keyCode == 38) { // if left or up is pressed, set focus 1 back
                if (nameInput === document.activeElement) {
                    stockInput.focus();
                } else if (priceInput === document.activeElement) { // checks if priceInput is focused
                    nameInput.focus();
                } else if (stockInput === document.activeElement) {
                    priceInput.focus();
                } else {
                    nameInput.focus();
                }
            } else {
                if (nameInput === document.activeElement) {
                    priceInput.focus();
                } else if (priceInput === document.activeElement) {
                    stockInput.focus();
                } else {
                    nameInput.focus();
                }
            }
        }
    }
});

function resizeProductsGrid() {
    prodDiv.style.gridTemplateColumns = `repeat(auto-fill, minmax(100px, 1fr))`;
    const productsChildren = document.querySelectorAll(".products > div");
    let biggestWidth = 0;
    for (const child of productsChildren) {
        if (child.offsetWidth > biggestWidth) {
            biggestWidth = child.offsetWidth;
        };
        prodDiv.style.gridTemplateColumns = `repeat(auto-fill, minmax(${biggestWidth + 11}px, 1fr))`;
    }
};

drawProducts();
drawCartItems();