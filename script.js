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

// Render products dynamically on the page
function renderProducts() {
    const products = [
        { id: 1, name: "Crypto Tool 1", price: 50, stock: 10 },
        { id: 2, name: "Crypto Tool 2", price: 75, stock: 5 },
        { id: 3, name: "Crypto Tool 3", price: 100, stock: Infinity }
    ];

    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = products.map(product => `
        <div class="product">
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
