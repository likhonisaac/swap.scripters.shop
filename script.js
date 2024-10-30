// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "https://storage.sell.app/store/49175/listings/hs9KNLIrVKmiqK9GExzjpk5vwbuWfV2th7Iq6YAn.jpg", stock: Infinity },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "https://storage.sell.app/store/49175/listings/5jHYcH7r0Pcr1Pp8yjWlSNHLdM7bl9yystNCuCQO.webp", stock: Infinity },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "https://storage.sell.app/store/49175/listings/kcdSyWdCFmRyYU86U7CqDyUO9oCk9JYWYzVvyXID.png", stock: Infinity },
    { id: 4, name: "Real USDT Sender", price: 250, image: "https://storage.sell.app/store/49175/listings/c01sS76Of9OXZhH3qROTEGyzFH81Rnjk8dQ1Bbf6.webp", stock: Infinity },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "https://storage.sell.app/store/49175/listings/Ke9rDCgH7bTSniVhnXeiwChgejhASyfx4DjJzFdO.jpg", stock: 500 },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "https://storage.sell.app/store/49175/listings/dbaeCoLGZCX2h1OkHLIF92hG47YbYEo8mHVo6xpS.png", stock: Infinity },
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
                <p class="product-stock">${product.stock === Infinity ? 'In Stock' : `${product.stock} in stock`}</p>
                <button class="buy-button" onclick="buyProduct(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Buy Now
                </button>
            </div>
        </div>
    `).join('');
}

// Connect to the user's wallet (supports MetaMask and WalletConnect)
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            alert(`Wallet connected: ${accounts[0]}`);
            document.querySelector('.wallet-button').innerHTML = '<i class="fas fa-wallet"></i> Wallet Connected';
        } catch (error) {
            handleError("Wallet connection error:", error);
        }
    } else {
        alert("No compatible wallet detected. Please install MetaMask or use WalletConnect.");
    }
}

// Handle product purchase
async function buyProduct(id) {
    const product = products.find(p => p.id === id);
    if (product.stock > 0) {
        if (product.stock !== Infinity) {
            product.stock--; // Decrease stock count
        }
        alert(`Initiating purchase for product: ${product.name}\nPrice: $${product.price}`);
        renderProducts(); // Re-render products to update stock
    } else {
        alert(`Sorry, ${product.name} is out of stock.`);
    }
}

// Handle errors
function handleError(message, error) {
    console.error(message, error);
    alert("An error occurred. Please try again later.");
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
