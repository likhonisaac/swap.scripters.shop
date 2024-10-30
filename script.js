// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "https://storage.sell.app/store/49175/listings/hs9KNLIrVKmiqK9GExzjpk5vwbuWfV2th7Iq6YAn.jpg", stock: Infinity },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "https://storage.sell.app/store/49175/listings/5jHYcH7r0Pcr1Pp8yjWlSNHLdM7bl9yystNCuCQO.webp", stock: Infinity },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "https://storage.sell.app/store/49175/listings/kcdSyWdCFmRyYU86U7CqDyUO9oCk9JYWYzVvyXID.png", stock: Infinity },
    { id: 4, name: "Real USDT Sender", price: 250, image: "https://storage.sell.app/store/49175/listings/c01sS76Of9OXZhH3qROTEGyzFH81Rnjk8dQ1Bbf6.webp", stock: Infinity },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "https://storage.sell.app/store/49175/listings/Ke9rDCgH7bTSniVhnXeiwChgejhASyfx4DjJzFdO.jpg", stock: 500 },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "https://storage.sell.app/store/49175/listings/dbaeCoLGZCX2h1OkHLIF92hG47YbYEo8mHVo6xpS.png", stock: Infinity },
];

// Initialize TonConnect
let tonConnect;
const tonAddress = "UQAYo6LjrKrCvFoFecSVb9rR-75hjbhw1KvyiljIpFguLmMd";

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

// Connect to the user's wallet
async function connectWallet() {
    try {
        tonConnect = new TonConnect({
            // Configuration for TonConnect
            project: "scripters.shop", // Your project name
            manifestUrl: "https://raw.githubusercontent.com/likhonisaac/swap.scripters.shop/refs/heads/main/manifest.json"
        });

        const connected = await tonConnect.connect();
        if (connected) {
            const account = await tonConnect.getAccount();
            alert(`Wallet connected: ${account.address}`);
        }
    } catch (error) {
        handleError("Wallet connection error:", error);
    }
}

// Handle product purchase
async function buyProduct(id) {
    const product = products.find(p => p.id === id);
    if (product.stock > 0) {
        if (product.stock !== Infinity) {
            product.stock--; // Decrease stock count
        }

        try {
            const amountInTon = product.price * 1000000000; // Convert price to TON (if needed)
            const tx = {
                to: tonAddress,
                amount: amountInTon,
                // Optional: add a comment or other transaction details if needed
            };

            const response = await tonConnect.sendTransaction(tx);
            alert(`Successfully purchased: ${product.name}\nPrice: $${product.price}`);
            console.log("Transaction response:", response);
        } catch (error) {
            handleError("Transaction failed:", error);
        }

        renderProducts(); // Re-render products to update stock
    } else {
        alert(`Sorry, ${product.name} is out of stock.`);
    }
}

// Fetch and use manifest data
async function fetchManifest() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/likhonisaac/swap.scripters.shop/refs/heads/main/manifest.json?token=GHSAT0AAAAAACZNMQ6COBWJL5QYHS5BWN6SZZCARNA');
        const manifest = await response.json();
        console.log("Manifest data:", manifest);
        // You can use the manifest data for various purposes like displaying app information, etc.
    } catch (error) {
        console.error("Failed to fetch manifest:", error);
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
    fetchManifest(); // Fetch the manifest data on page load
});
