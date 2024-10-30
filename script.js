// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "https://storage.sell.app/store/49175/listings/hs9KNLIrVKmiqK9GExzjpk5vwbuWfV2th7Iq6YAn.jpg", stock: Infinity },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "https://storage.sell.app/store/49175/listings/5jHYcH7r0Pcr1Pp8yjWlSNHLdM7bl9yystNCuCQO.webp", stock: Infinity },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "https://storage.sell.app/store/49175/listings/kcdSyWdCFmRyYU86U7CqDyUO9oCk9JYWYzVvyXID.png", stock: Infinity },
    { id: 4, name: "Real USDT Sender", price: 250, image: "https://storage.sell.app/store/49175/listings/c01sS76Of9OXZhH3qROTEGyzFH81Rnjk8dQ1Bbf6.webp", stock: Infinity },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "https://storage.sell.app/store/49175/listings/Ke9rDCgH7bTSniVhnXeiwChgejhASyfx4DjJzFdO.jpg", stock: 500 },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "https://storage.sell.app/store/49175/listings/dbaeCoLGZCX2h1OkHLIF92hG47YbYEo8mHVo6xpS.png", stock: Infinity }
];

// Global variable to track connection status
let isConnected = false;

// Connect to the user's wallet
async function connectWallet() {
    try {
        tonConnect = new TonConnect({ project: "tonconnect-manifest.json" });
        
        // Try connecting
        const connected = await tonConnect.connect();

        if (connected) {
            const account = await tonConnect.getAccount();
            document.getElementById("wallet-status").textContent = `Wallet connected: ${account.address}`;
            document.getElementById("connect-wallet-button").disabled = true;
            isConnected = true; // Set connection status to true
        } else {
            throw new Error("Failed to connect wallet.");
        }
    } catch (error) {
        handleError("Wallet connection error:", error);
    }
}

// Handle product purchase
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
            product.stock--; // Decrease stock count
        }

        try {
            const amountInTon = product.price * 1000000000; // Convert price to TON
            const tx = { to: tonAddress, amount: amountInTon };

            console.log("Sending transaction:", tx);
            const response = await tonConnect.sendTransaction(tx); // Ensure `tonConnect` is connected
            
            alert(`Successfully purchased: ${product.name}\nPrice: $${product.price}`);
            console.log("Transaction response:", response);
            renderProducts(); // Update stock
        } catch (error) {
            handleError("Transaction failed:", error);
            product.stock++; // Restore stock if transaction fails
        }
    } else {
        alert(`Sorry, ${product.name} is out of stock.`);
    }
}

// Handle errors with logging and user feedback
function handleError(message, error = {}) {
    console.error(message, error);
    alert("An error occurred. Please try again later.");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
