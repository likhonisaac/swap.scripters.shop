// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "https://storage.sell.app/store/49175/listings/hs9KNLIrVKmiqK9GExzjpk5vwbuWfV2th7Iq6YAn.jpg", stock: Infinity },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "https://storage.sell.app/store/49175/listings/5jHYcH7r0Pcr1Pp8yjWlSNHLdM7bl9yystNCuCQO.webp", stock: Infinity },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "https://storage.sell.app/store/49175/listings/kcdSyWdCFmRyYU86U7CqDyUO9oCk9JYWYzVvyXID.png", stock: Infinity },
    { id: 4, name: "Real USDT Sender", price: 250, image: "https://storage.sell.app/store/49175/listings/c01sS76Of9OXZhH3qROTEGyzFH81Rnjk8dQ1Bbf6.webp", stock: Infinity },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "https://storage.sell.app/store/49175/listings/Ke9rDCgH7bTSniVhnXeiwChgejhASyfx4DjJzFdO.jpg", stock: 500 },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "https://storage.sell.app/store/49175/listings/dbaeCoLGZCX2h1OkHLIF92hG47YbYEo8mHVo6xpS.png", stock: Infinity }
];

// Initialize TonConnect globally to track wallet connection
let tonConnect;
let isConnected = false; // Track connection status

// Initialize wallet connection UI on page load
document.addEventListener("DOMContentLoaded", async () => {
    renderProducts(); // Load products on page
    initializeTonConnect(); // Initialize TonConnect connection
});

// Initialize TonConnect connection
async function initializeTonConnect() {
    try {
        tonConnect = new TonConnect({ manifestUrl: 'https://swap.scripters.shop/tonconnect-manifest.json' });
        
        // Try to establish connection status
        const connected = await tonConnect.connect();

        if (connected) {
            const account = await tonConnect.getAccount();
            document.getElementById("wallet-status").textContent = `Wallet connected: ${account.address}`;
            document.getElementById("connect-wallet-button").disabled = true;
            isConnected = true;
        } else {
            document.getElementById("wallet-status").textContent = "Connect your wallet to begin";
        }
    } catch (error) {
        handleError("Failed to initialize TonConnect:", error);
    }
}

// Connect to wallet function
async function connectWallet() {
    try {
        // Check if already connected
        if (isConnected) {
            alert("Wallet already connected.");
            return;
        }

        const connected = await tonConnect.connect();
        if (connected) {
            const account = await tonConnect.getAccount();
            document.getElementById("wallet-status").textContent = `Wallet connected: ${account.address}`;
            document.getElementById("connect-wallet-button").disabled = true;
            isConnected = true;
        } else {
            alert("Unable to connect wallet.");
        }
    } catch (error) {
        handleError("Wallet connection error:", error);
    }
}

// Render products dynamically on the page with images and prices
function renderProducts() {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="buy-button" onclick="buyProduct(${product.id})">
                Buy Now
            </button>
        </div>
    `).join('');
}

// Buy product function with error handling and transaction flow
async function buyProduct(id) {
    if (!isConnected || !tonConnect) {
        alert("Please connect your wallet before purchasing.");
        return;
    }

    const product = products.find(p => p.id === id);
    if (!product) {
        alert("Product not found.");
        return;
    }

    if (product.stock > 0) {
        if (product.stock !== Infinity) {
            product.stock--; // Decrease stock if not unlimited
        }

        try {
            const amountInTon = product.price * 1000000000; // Convert price to TON
            const tx = { to: "UQAYo6LjrKrCvFoFecSVb9rR-75hjbhw1KvyiljIpFguLmMd", amount: amountInTon };

            console.log("Sending transaction:", tx);
            const response = await tonConnect.sendTransaction(tx);
            
            alert(`Successfully purchased: ${product.name}\nPrice: $${product.price}`);
            console.log("Transaction response:", response);
            renderProducts(); // Update stock
        } catch (error) {
            handleError("Transaction failed:", error);
            if (product.stock !== Infinity) {
                product.stock++; // Restore stock on failure
            }
        }
    } else {
        alert(`Sorry, ${product.name} is out of stock.`);
    }
}

// Handle errors gracefully
function handleError(message, error = {}) {
    console.error(message, error);
    alert("An error occurred. Please try again later.");
}
