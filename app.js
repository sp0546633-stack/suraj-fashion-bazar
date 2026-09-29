/* =========================================================
   SURAJ FASHION BAZAR
   APP.JS - COMPLETE
   ========================================================= */


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products = [

    {
        id: 1,
        name: "Classic Men T-Shirt",
        category: "Men",
        price: 349,
        oldPrice: 699,
        discount: 50,
        image: "👕"
    },

    {
        id: 2,
        name: "Premium Ladies Dress",
        category: "Women",
        price: 844,
        oldPrice: 1299,
        discount: 35,
        image: "👗"
    },

    {
        id: 3,
        name: "Sport Running Shoes",
        category: "Shoes",
        price: 1199,
        oldPrice: 1599,
        discount: 25,
        image: "👟"
    },

    {
        id: 4,
        name: "Classic Fashion Watch",
        category: "Watches",
        price: 699,
        oldPrice: 999,
        discount: 30,
        image: "⌚"
    },

    {
        id: 5,
        name: "Men Casual Shirt",
        category: "Men",
        price: 649,
        oldPrice: 999,
        discount: 35,
        image: "👔"
    },

    {
        id: 6,
        name: "Women Handbag",
        category: "Accessories",
        price: 699,
        oldPrice: 1399,
        discount: 50,
        image: "👜"
    },

    {
        id: 7,
        name: "Street Sneakers",
        category: "Shoes",
        price: 1424,
        oldPrice: 1899,
        discount: 25,
        image: "👟"
    },

    {
        id: 8,
        name: "Luxury Style Watch",
        category: "Watches",
        price: 1104,
        oldPrice: 1699,
        discount: 35,
        image: "⌚"
    },

    {
        id: 9,
        name: "Men Premium Hoodie",
        category: "Men",
        price: 749,
        oldPrice: 1499,
        discount: 50,
        image: "🧥"
    },

    {
        id: 10,
        name: "Women Fashion Bag",
        category: "Accessories",
        price: 779,
        oldPrice: 1199,
        discount: 35,
        image: "👜"
    },

    {
        id: 11,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 674,
        oldPrice: 899,
        discount: 25,
        image: "🕶️"
    },

    {
        id: 12,
        name: "Women Sandals",
        category: "Shoes",
        price: 974,
        oldPrice: 1299,
        discount: 25,
        image: "👡"
    }

];


/* =========================================================
   STORAGE
   ========================================================= */

const CART_KEY = "SFB_CART";
const WISHLIST_KEY = "SFB_WISHLIST";
const USER_KEY = "SFB_USER";
const ORDERS_KEY = "SFB_ORDERS";


let cart = JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
);

let wishlist = JSON.parse(
    localStorage.getItem(WISHLIST_KEY) || "[]"
);

let currentCategory = "All";


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderProducts();

        updateCartCount();

        updateWishlistCount();

        setupFilters();

    }
);


/* =========================================================
   SETUP FILTERS
   ========================================================= */

function setupFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const productSearch =
        document.getElementById("productSearch");

    const priceFilter =
        document.getElementById("priceFilter");

    const discountFilter =
        document.getElementById("discountFilter");

    const sortFilter =
        document.getElementById("sortFilter");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                if (productSearch) {
                    productSearch.value =
                        searchInput.value;
                }

                applyFilters();

            }
        );

    }


    if (productSearch) {

        productSearch.addEventListener(
            "input",
            function () {

                if (searchInput) {
                    searchInput.value =
                        productSearch.value;
                }

                applyFilters();

            }
        );

    }


    if (priceFilter) {

        priceFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (discountFilter) {

        discountFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            applyFilters
        );

    }

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(list = products) {

    const grid =
        document.getElementById("productGrid");

    const noProducts =
        document.getElementById("noProducts");

    if (!grid) return;


    grid.innerHTML = "";


    if (list.length === 0) {

        if (noProducts) {
            noProducts.style.display = "block";
        }

        updateProductResult(0);

        return;
    }


    if (noProducts) {
        noProducts.style.display = "none";
    }


    list.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className = "productCard";


        const isWishlisted =
            wishlist.includes(product.id);


        card.innerHTML = `

            <div class="productImage">

                <span class="discountBadge">
                    ${product.discount}% OFF
                </span>

                <button
                    class="wishlistBtn"
                    onclick="toggleWishlist(${product.id})"
                >
                    ${isWishlisted ? "❤️" : "♡"}
                </button>

                <span>
                    ${product.image}
                </span>

            </div>


            <div class="productInfo">

                <div class="productCategory">
                    ${product.category}
                </div>

                <h3>
                    ${product.name}
                </h3>


                <div class="productPrice">

                    <strong>
                        ₹${product.price}
                    </strong>

                    <span class="oldPrice">
                        ₹${product.oldPrice}
                    </span>

                    <span class="discountText">
                        ${product.discount}% OFF
                    </span>

                </div>


                <div class="productActions">

                    <button
                        class="viewBtn"
                        onclick="openProduct(${product.id})"
                    >
                        👁️ View
                    </button>

                    <button
                        class="cartBtn"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Cart
                    </button>

                    <button
                        class="buyBtn"
                        onclick="buyNow(${product.id})"
                    >
                        ⚡ Buy Now
                    </button>

                </div>

            </div>
        `;


        grid.appendChild(card);

    });


    updateProductResult(list.length);

}


/* =========================================================
   PRODUCT RESULT COUNT
   ========================================================= */

function updateProductResult(count) {

    const result =
        document.getElementById("productResult");

    if (!result) return;


    result.textContent =
        count + (count === 1 ? " Product" : " Products");

}


/* =========================================================
   FILTER CATEGORY
   ========================================================= */

function filterCategory(category) {

    currentCategory = category;


    document.querySelectorAll(
        ".categoryBtn"
    ).forEach(function (button) {

        button.classList.remove("active");

        if (
            button.dataset.category === category
        ) {

            button.classList.add("active");

        }

    });


    applyFilters();


    const productsSection =
        document.getElementById("products");

    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   APPLY FILTERS
   ========================================================= */

function applyFilters() {

    const searchInput =
        document.getElementById("productSearch");

    const priceFilter =
        document.getElementById("priceFilter");

    const discountFilter =
        document.getElementById("discountFilter");

    const sortFilter =
        document.getElementById("sortFilter");


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const price =
        priceFilter
            ? priceFilter.value
            : "ALL";


    const discount =
        discountFilter
            ? discountFilter.value
            : "ALL";


    const sort =
        sortFilter
            ? sortFilter.value
            : "DEFAULT";


    let filtered =
        products.filter(function (product) {


            /* SEARCH */

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            /* CATEGORY */

            const matchesCategory =
                currentCategory === "All" ||
                product.category === currentCategory;


            /* PRICE */

            let matchesPrice = true;


            if (price === "0-500") {

                matchesPrice =
                    product.price < 500;

            }

            else if (price === "500-1000") {

                matchesPrice =
                    product.price >= 500 &&
                    product.price <= 1000;

            }

            else if (price === "1000+") {

                matchesPrice =
                    product.price > 1000;

            }


            /* DISCOUNT */

            let matchesDiscount = true;


            if (discount === "25") {

                matchesDiscount =
                    product.discount === 25;

            }

            else if (discount === "35") {

                matchesDiscount =
                    product.discount === 35;

            }

            else if (discount === "50") {

                matchesDiscount =
                    product.discount === 50;

            }

            else if (discount === "50PLUS") {

                matchesDiscount =
                    product.discount >= 50;

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesDiscount
            );

        });


    /* SORT */

    if (sort === "LOW") {

        filtered.sort(
            (a, b) =>
                a.price - b.price
        );

    }

    else if (sort === "HIGH") {

        filtered.sort(
            (a, b) =>
                b.price - a.price
        );

    }

    else if (sort === "DISCOUNT") {

        filtered.sort(
            (a, b) =>
                b.discount - a.discount
        );

    }

    else if (sort === "NAME") {

        filtered.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    renderProducts(filtered);

}


/* =========================================================
   RESET FILTER
   ========================================================= */

function resetFilters() {

    currentCategory = "All";


    const searchInput =
        document.getElementById("searchInput");

    const productSearch =
        document.getElementById("productSearch");

    const priceFilter =
        document.getElementById("priceFilter");

    const discountFilter =
        document.getElementById("discountFilter");

    const sortFilter =
        document.getElementById("sortFilter");


    if (searchInput)
        searchInput.value = "";


    if (productSearch)
        productSearch.value = "";


    if (priceFilter)
        priceFilter.value = "ALL";


    if (discountFilter)
        discountFilter.value = "ALL";


    if (sortFilter)
        sortFilter.value = "DEFAULT";


    document.querySelectorAll(
        ".categoryBtn"
    ).forEach(function (button) {

        button.classList.remove("active");

        if (
            button.dataset.category === "All"
        ) {

            button.classList.add("active");

        }

    });


    renderProducts();

}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function getProduct(id) {

    return products.find(
        product =>
            product.id === Number(id)
    );

}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(id) {

    window.location.href =
        "product.html?id=" + id;

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(id, quantity = 1) {

    const product =
        getProduct(id);

    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity += quantity;

    }

    else {

        cart.push({

            id: product.id,

            quantity: quantity

        });

    }


    saveCart();

    updateCartCount();

    showToast(
        "🛒 Product Cart में add हो गया"
    );

}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyNow(id) {

    const product =
        getProduct(id);

    if (!product) return;


    localStorage.setItem(
        "SFB_BUY_NOW",
        JSON.stringify({

            id: product.id,

            quantity: 1

        })
    );


    window.location.href =
        "checkout.html?buyNow=" + product.id;

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        cart.reduce(
            function (total, item) {

                return total + item.quantity;

            },
            0
        );


    const element =
        document.getElementById("cartCount");


    if (element) {
        element.textContent = count;
    }

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const modal =
        document.getElementById("cartModal");


    if (!modal) {

        window.location.href =
            "checkout.html";

        return;

    }


    renderCart();

    modal.style.display = "block";

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) return;


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:35px;
                "
            >

                <div style="font-size:50px;">
                    🛒
                </div>

                <h3>
                    आपका Cart खाली है
                </h3>

                <p>
                    कुछ products add करें।
                </p>

            </div>

        `;


        updateCartSummary(0);

        return;

    }


    let subtotal = 0;


    cart.forEach(function (item) {

        const product =
            getProduct(item.id);

        if (!product) return;


        const itemTotal =
            product.price *
            item.quantity;


        subtotal += itemTotal;


        const div =
            document.createElement("div");


        div.className =
            "cartItem";


        div.innerHTML = `

            <div class="cartItemImage">
                ${product.image}
            </div>


            <div class="cartItemInfo">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ₹${product.price}
                </p>

            </div>


            <div class="cartQty">

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        -1
                    )"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(
                        ${product.id},
                        1
                    )"
                >
                    +
                </button>

            </div>


            <button
                class="removeCartBtn"
                onclick="removeFromCart(${product.id})"
            >
                🗑️
            </button>

        `;


        container.appendChild(div);

    });


    updateCartSummary(subtotal);

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(id, change) {

    const item =
        cart.find(
            item =>
                item.id === Number(id)
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    item.id !== Number(id)
            );

    }


    saveCart();

    updateCartCount();

    renderCart();

}


/* =========================================================
   REMOVE CART
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== Number(id)
        );


    saveCart();

    updateCartCount();

    renderCart();

    showToast(
        "Product Cart से remove हो गया"
    );

}


/* =========================================================
   CART SUMMARY
   ========================================================= */

function updateCartSummary(subtotal) {

    const delivery =
        subtotal > 0 ? 50 : 0;


    const total =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById("cartSubtotal");


    const deliveryElement =
        document.getElementById("cartDelivery");


    const totalElement =
        document.getElementById("cartTotal");


    if (subtotalElement)
        subtotalElement.textContent =
            "₹" + subtotal;


    if (deliveryElement)
        deliveryElement.textContent =
            "₹" + delivery;


    if (totalElement)
        totalElement.textContent =
            "₹" + total;

}


/* =========================================================
   GO TO CHECKOUT
   ========================================================= */

function goToCheckout() {

    if (cart.length === 0) {

        showToast(
            "पहले Cart में product add करें"
        );

        return;

    }


    window.location.href =
        "checkout.html";

}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(id) {

    id = Number(id);


    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item =>
                    item !== id
            );

        showToast(
            "❤️ Wishlist से remove हो गया"
        );

    }

    else {

        wishlist.push(id);

        showToast(
            "❤️ Wishlist में add हो गया"
        );

    }


    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );


    updateWishlistCount();

    renderProducts(
        getCurrentlyFilteredProducts()
    );

}


/* =========================================================
   GET CURRENT FILTERED PRODUCTS
   ========================================================= */

function getCurrentlyFilteredProducts() {

    const searchInput =
        document.getElementById("productSearch");

    const priceFilter =
        document.getElementById("priceFilter");

    const discountFilter =
        document.getElementById("discountFilter");

    const sortFilter =
        document.getElementById("sortFilter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const price =
        priceFilter
            ? priceFilter.value
            : "ALL";


    const discount =
        discountFilter
            ? discountFilter.value
            : "ALL";


    const sort =
        sortFilter
            ? sortFilter.value
            : "DEFAULT";


    let list =
        products.filter(function (product) {

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =
                currentCategory === "All" ||
                product.category === currentCategory;


            let priceMatch = true;


            if (price === "0-500")
                priceMatch = product.price < 500;


            if (price === "500-1000")
                priceMatch =
                    product.price >= 500 &&
                    product.price <= 1000;


            if (price === "1000+")
                priceMatch =
                    product.price > 1000;


            let discountMatch = true;


            if (discount === "25")
                discountMatch =
                    product.discount === 25;


            if (discount === "35")
                discountMatch =
                    product.discount === 35;


            if (discount === "50")
                discountMatch =
                    product.discount === 50;


            if (discount === "50PLUS")
                discountMatch =
                    product.discount >= 50;


            return (
                searchMatch &&
                categoryMatch &&
                priceMatch &&
                discountMatch
            );

        });


    if (sort === "LOW") {

        list.sort(
            (a,b) =>
                a.price - b.price
        );

    }

    if (sort === "HIGH") {

        list.sort(
            (a,b) =>
                b.price - a.price
        );

    }

    if (sort === "DISCOUNT") {

        list.sort(
            (a,b) =>
                b.discount - a.discount
        );

    }

    if (sort === "NAME") {

        list.sort(
            (a,b) =>
                a.name.localeCompare(b.name)
        );

    }


    return list;

}


/* =========================================================
   UPDATE WISHLIST COUNT
   ========================================================= */

function updateWishlistCount() {

    const element =
        document.getElementById(
            "wishlistCount"
        );


    if (element) {

        element.textContent =
            wishlist.length;

    }

}


/* =========================================================
   OPEN WISHLIST
   ========================================================= */

function openWishlist() {

    const modal =
        document.getElementById(
            "wishlistModal"
        );


    if (!modal) return;


    renderWishlist();

    modal.style.display = "block";

}


/* =========================================================
   RENDER WISHLIST
   ========================================================= */

function renderWishlist() {

    const container =
        document.getElementById(
            "wishlistItems"
        );


    if (!container) return;


    container.innerHTML = "";


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:35px;
                "
            >

                <div style="font-size:50px;">
                    ❤️
                </div>

                <h3>
                    Wishlist खाली है
                </h3>

            </div>

        `;

        return;

    }


    wishlist.forEach(function (id) {

        const product =
            getProduct(id);

        if (!product) return;


        const div =
            document.createElement("div");


        div.className =
            "wishlistItem";


        div.innerHTML = `

            <div class="wishlistImage">
                ${product.image}
            </div>


            <div class="wishlistInfo">

                <h4>
                    ${product.name}
                </h4>

                <strong>
                    ₹${product.price}
                </strong>

            </div>


            <button
                class="cartBtn"
                onclick="addToCart(${product.id})"
            >
                🛒
            </button>


            <button
                class="removeCartBtn"
                onclick="toggleWishlist(${product.id})"
            >
                🗑️
            </button>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   LOGIN
   ========================================================= */

function openLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (!modal) return;


    modal.style.display = "block";

}


function loginUser() {

    const name =
        document.getElementById(
            "loginName"
        )?.value.trim();


    const mobile =
        document.getElementById(
            "loginMobile"
        )?.value.trim();


    if (!name) {

        showToast(
            "अपना नाम डालें"
        );

        return;

    }


    if (
        mobile &&
        !/^[0-9]{10}$/.test(mobile)
    ) {

        showToast(
            "10 digit mobile number डालें"
        );

        return;

    }


    const user = {

        name: name,

        mobile: mobile

    };


    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );


    closeModal("loginModal");


    showToast(
        "👤 Welcome " + name
    );

}


/* =========================================================
   MODAL CLOSE
   ========================================================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.style.display =
            "none";

    }

}


/* =========================================================
   CLOSE MODAL WHEN CLICK OUTSIDE
   ========================================================= */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList &&
            event.target.classList.contains("modal")
        ) {

            event.target.style.display =
                "none";

        }

    }
);


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) return;


    toast.textContent =
        message;


    toast.style.display =
        "block";


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            function () {

                toast.style.display =
                    "none";

            },
            2500
        );

}


/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.log(
            "Suraj Fashion Bazar:",
            event.message
        );

    }
);