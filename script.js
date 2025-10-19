// Cart logic stays same as before...
let products = [];
let cart = JSON.parse(localStorage.getItem("noamcorpCart")) || [];

// Fetch products from JSON
async function loadProducts() {
    const res = await fetch("/products/products.json");
    products = await res.json();
    renderProducts();
}

// Render Products
function renderProducts() {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            <strong>$${prod.price}</strong>
            <button onclick="addToCart('${prod.id}')">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Cart functions
function addToCart(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    cart.push(prod);
    localStorage.setItem("noamcorpCart", JSON.stringify(cart));
    alert(`${prod.name} added to cart!`);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("noamcorpCart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-container");
    container.innerHTML = "";
    cart.forEach((item, idx) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `${item.name} - $${item.price} <button onclick="removeFromCart(${idx})">Remove</button>`;
        container.appendChild(div);
    });
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    container.innerHTML += `<p>Total: $${total}</p><button onclick="checkout()">Checkout</button>`;
}

// Checkout logic with automatic JSON write
async function checkout() {
    if(cart.length === 0) return alert("Cart is empty!");

    for (const item of cart) {
        const purchase = {
            product: item.name,
            buyer: "buyer@example.com",
            amount: item.price,
            currency: "USD",
            paymentMethod: "Stripe/Gumroad"
        };
        await fetch("/api/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(purchase)
        });
    }

    alert("Checkout complete! Purchases recorded.");
    cart = [];
    localStorage.setItem("noamcorpCart", JSON.stringify(cart));
    renderCart();
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("noamcorpDarkMode", mode);
}

// Apply stored mode on load
if(localStorage.getItem("noamcorpDarkMode") === "dark") {
    document.body.classList.add("dark-mode");
}

window.onload = () => {
    loadProducts();
    renderCart();
};

