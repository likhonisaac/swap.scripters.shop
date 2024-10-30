// script.js

// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "https://storage.sell.app/store/49175/listings/hs9KNLIrVKmiqK9GExzjpk5vwbuWfV2th7Iq6YAn.jpg", stock: "∞" },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "https://storage.sell.app/store/49175/listings/5jHYcH7r0Pcr1Pp8yjWlSNHLdM7bl9yystNCuCQO.webp", stock: "∞" },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "https://storage.sell.app/store/49175/listings/kcdSyWdCFmRyYU86U7CqDyUO9oCk9JYWYzVvyXID.png", stock: "∞" },
    { id: 4, name: "Real USDT Sender", price: 250, image: "https://storage.sell.app/store/49175/listings/c01sS76Of9OXZhH3qROTEGyzFH81Rnjk8dQ1Bbf6.webp", stock: "∞" },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "https://storage.sell.app/store/49175/listings/Ke9rDCgH7bTSniVhnXeiwChgejhASyfx4DjJzFdO.jpg", stock: "500" },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "https://storage.sell.app/store/49175/listings/dbaeCoLGZCX2h1OkHLIF92hG47YbYEo8mHVo6xpS.png", stock: "∞" },
];

// Render products to the page
function renderProducts() {
    const productsGrid = document.getElementById('products');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="buy-button" onclick="buyProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Connect to the user's wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            alert(`Wallet connected: ${accounts[0]}`);
        } catch (error) {
            console.error("Wallet connection error:", error);
        }
    } else {
        alert("MetaMask not detected. Please install it to connect your wallet.");
    }
}

// Handle product purchase
function buyProduct(id) {
    alert(`Initiating purchase for product ID: ${id}`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
