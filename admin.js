const ORDERS_KEY = "SFB_ORDERS";

let orders = [];


// ===============================
// LOAD ORDERS
// ===============================

function loadOrders() {
    try {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (error) {
        orders = [];
    }

    renderStats();
    renderOrders();
}


// ===============================
// SAVE ORDERS
// ===============================

function saveOrders() {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}


// ===============================
// HTML SECURITY
// ===============================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(dateValue) {

    if (!dateValue) {
        return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// ===============================
// FORMAT MONEY
// ===============================

function money(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
}


// ===============================
// STATUS CLASS
// ===============================

function getStatusClass(status) {

    switch (status) {

        case "Confirmed":
            return "statusConfirmed";

        case "Shipped":
            return "statusShipped";

        case "Delivered":
            return "statusDelivered";

        case "Cancelled":
            return "statusCancelled";

        default:
            return "statusPending";
    }
}


// ===============================
// STATISTICS
// ===============================

function renderStats() {

    const totalOrders = orders.length;

    const totalSales = orders.reduce((sum, order) => {
        return sum + Number(order.total || 0);
    }, 0);

    const pendingOrders = orders.filter(
        order => order.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        order => order.status === "Delivered"
    ).length;


    document.getElementById("totalOrders").textContent =
        totalOrders;

    document.getElementById("totalSales").textContent =
        money(totalSales);

    document.getElementById("pendingOrders").textContent =
        pendingOrders;

    document.getElementById("deliveredOrders").textContent =
        deliveredOrders;
}


// ===============================
// GET FILTERED ORDERS
// ===============================

function getFilteredOrders() {

    const search =
        document.getElementById("orderSearch").value
            .trim()
            .toLowerCase();

    const status =
        document.getElementById("statusFilter").value;


    return orders.filter(order => {

        const customer = order.customer || {};

        const searchableText = [

            order.id,

            customer.name,

            customer.mobile,

            customer.email,

            customer.city

        ]
        .join(" ")
        .toLowerCase();


        const matchesSearch =
            !search ||
            searchableText.includes(search);


        const matchesStatus =
            status === "ALL" ||
            order.status === status;


        return matchesSearch && matchesStatus;
    });
}


// ===============================
// RENDER ORDERS
// ===============================

function renderOrders() {

    const container =
        document.getElementById("ordersContainer");

    const filteredOrders =
        getFilteredOrders();


    if (filteredOrders.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h2>📦 कोई Order नहीं मिला</h2>
                <p style="margin-top:8px;">
                    अभी कोई matching order उपलब्ध नहीं है।
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredOrders.map(createOrderHTML).join("");
}


// ===============================
// CREATE ORDER HTML
// ===============================

function createOrderHTML(order) {

    const customer = order.customer || {};

    const items = Array.isArray(order.items)
        ? order.items
        : [];


    const status =
        order.status || "Pending";


    const paymentMethod =
        order.paymentMethod || "COD";


    const itemsHTML = items.length

        ? items.map(item => `

            <div class="item">

                <div class="itemImage">
                    ${escapeHTML(item.image || "🛍️")}
                </div>

                <div class="itemInfo">

                    <strong>
                        ${escapeHTML(item.name || "Product")}
                    </strong>

                    <span>
                        Qty: ${Number(item.quantity || 1)}
                        × ${money(item.price)}
                    </span>

                </div>

            </div>

        `).join("")

        : `
            <p>No product information available.</p>
        `;


    return `

        <div class="orderCard">

            <div class="orderTop">

                <div>
                    <div class="orderId">
                        🧾 ${escapeHTML(order.id || "Unknown")}
                    </div>

                    <div class="orderDate">
                        ${formatDate(order.createdAt)}
                    </div>
                </div>


                <div>
                    <span class="status ${getStatusClass(status)}">
                        ${escapeHTML(status)}
                    </span>
                </div>

            </div>


            <div class="orderGrid">

                <!-- CUSTOMER -->
                <div class="box">

                    <h3>👤 Customer Details</h3>

                    <p>
                        <b>Name:</b>
                        ${escapeHTML(customer.name || "-")}
                    </p>

                    <p>
                        <b>Mobile:</b>
                        ${escapeHTML(customer.mobile || "-")}
                    </p>

                    <p>
                        <b>Email:</b>
                        ${escapeHTML(customer.email || "-")}
                    </p>

                    <p>
                        <b>Address:</b>
                        ${escapeHTML(customer.address || "-")}
                    </p>

                    <p>
                        <b>City:</b>
                        ${escapeHTML(customer.city || "-")}
                    </p>

                    <p>
                        <b>State:</b>
                        ${escapeHTML(customer.state || "-")}
                    </p>

                    <p>
                        <b>PIN:</b>
                        ${escapeHTML(customer.pin || "-")}
                    </p>

                </div>


                <!-- PRODUCTS -->
                <div class="box">

                    <h3>🛍️ Products</h3>

                    <div class="items">
                        ${itemsHTML}
                    </div>

                </div>

            </div>


            <div class="orderBottom">

                <div>

                    <div>
                        Payment:
                        <b>${escapeHTML(paymentMethod)}</b>
                    </div>

                    <div class="total">
                        Total: ${money(order.total)}
                    </div>

                </div>


                <div class="actions">

                    <select
                        onchange="changeOrderStatus('${escapeHTML(order.id)}', this.value)"
                    >

                        <option value="Pending"
                            ${status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="Confirmed"
                            ${status === "Confirmed" ? "selected" : ""}>
                            Confirmed
                        </option>

                        <option value="Shipped"
                            ${status === "Shipped" ? "selected" : ""}>
                            Shipped
                        </option>

                        <option value="Delivered"
                            ${status === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                        <option value="Cancelled"
                            ${status === "Cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>


                    <button
                        class="deleteBtn"
                        onclick="deleteOrder('${escapeHTML(order.id)}')"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>

        </div>

    `;
}


// ===============================
// CHANGE STATUS
// ===============================

function changeOrderStatus(orderId, newStatus) {

    const order =
        orders.find(order => order.id === orderId);


    if (!order) {
        return;
    }


    order.status = newStatus;

    saveOrders();

    renderStats();
    renderOrders();

}


// ===============================
// DELETE ORDER
// ===============================

function deleteOrder(orderId) {

    const order =
        orders.find(order => order.id === orderId);


    if (!order) {
        return;
    }


    const confirmDelete =
        confirm(
            "क्या आप यह Order delete करना चाहते हैं?"
        );


    if (!confirmDelete) {
        return;
    }


    orders =
        orders.filter(order => order.id !== orderId);


    saveOrders();

    renderStats();
    renderOrders();

}


// ===============================
// DELETE ALL ORDERS
// ===============================

function clearAllOrders() {

    if (orders.length === 0) {

        alert("Delete करने के लिए कोई Order नहीं है।");

        return;
    }


    const confirmDelete =
        confirm(
            "⚠️ क्या आप सभी Orders permanently delete करना चाहते हैं?"
        );


    if (!confirmDelete) {
        return;
    }


    orders = [];

    saveOrders();

    renderStats();
    renderOrders();

}


// ===============================
// SEARCH
// ===============================

document
    .getElementById("orderSearch")
    .addEventListener("input", renderOrders);


// ===============================
// STATUS FILTER
// ===============================

document
    .getElementById("statusFilter")
    .addEventListener("change", renderOrders);


// ===============================
// CLEAR ALL BUTTON
// ===============================

document
    .getElementById("clearAllBtn")
    .addEventListener("click", clearAllOrders);


// ===============================
// START ADMIN PANEL
// ===============================

loadOrders();