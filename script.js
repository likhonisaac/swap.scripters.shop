// Sample products data
const products = [
    { id: 1, name: "Bitcoin Flash Tool V6.5.1", price: 250, image: "bitcoin-tool.jpg", description: "A powerful tool for Bitcoin transactions.", stock: Infinity },
    { id: 2, name: "Flash Miner for Windows", price: 100, image: "flash-miner.jpg", description: "Efficient mining software for Windows.", stock: Infinity },
    { id: 3, name: "Flash USDT Full Package", price: 300, image: "usdt-package.jpg", description: "Complete USDT management solution.", stock: Infinity },
    { id: 4, name: "Real USDT Sender", price: 250, image: "real-usdt-sender.jpg", description: "Send USDT securely and instantly.", stock: Infinity },
    { id: 5, name: "Fake USDT Sender [APK]", price: 600, image: "fake-usdt-sender.jpg", description: "For testing purposes only.", stock: 500 },
    { id: 6, name: "Flash Miner Pro", price: 50, image: "flash-miner-pro.jpg", description: "Advanced mining software with enhanced features.", stock: Infinity },
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
                <p class="product-description">${product.description}</p>
                <button class="buy-button" onclick="buyProduct(${product.id})">Buy Now</button>
            </div>
        </div>
    `).join('');
}

// Connect to the user's wallet
async function connectWallet() {
    try {
        const onboard = await getOnboard();
        const wallets = [
            onboard.coinbaseWallet(),
            onboard.walletConnectWallet(),
            onboard.injectedWallet(),
            onboard.frameWallet(),
            onboard.fortmaticWallet(),
            onboard.walletLinkWallet(),
            onboard.torusWallet(),
            onboard.portisWallet(),
            onboard.authereumWallet(),
            onboard.magicWallet(),
            onboard.ledgerWallet(),
            onboard.trezorWallet(),
            onboard.gnosisSafeWallet(),
            onboard.dcentWallet(),
            onboard.bitskiWallet(),
            onboard.wallet()
        ];

        const walletsAppUrl = 'http://localhost:3000'; // Replace with your app's URL
        const connectedWallet = await onboard.connectWallet({wallets, appUrl: walletsAppUrl});
        console.log('Connected wallet:', connectedWallet);
        // Additional logic for handling connected wallet can be added here
    } catch (error) {
        handleError("Wallet connection error:", error);
    }
}

// Handle product purchase
function buyProduct(id) {
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
    // Additional initialization logic can go here (e.g., checking wallet connection)
});
