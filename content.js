function sendOrderAmount(amount) {
    if (!chrome.runtime || !chrome.runtime.sendMessage) {
        console.error("❌ chrome.runtime.sendMessage is not available. Background script may not be running.");
        return;
    }

    const totalAmount = amount * 100; // Multiply by 100

    chrome.runtime.sendMessage({ action: "sendAmount", totalAmount: totalAmount }, function(response) {
        if (chrome.runtime.lastError) {
            console.error("❌ Error sending message:", chrome.runtime.lastError);
        } else {
            console.log("📬 Background script response:", response);
        }
    });
}

// Function to check payment method and grab amount
function checkAndSendAmount() {
    const selectedPayment = document.querySelector(".pos-select-field__toggle__label");
    
    if (selectedPayment && selectedPayment.textContent.trim() === "ECR POS Payment") {
        console.log("✅ ECR POS Payment selected!");

        // Grab amount from the correct input field
        const amountInput = document.querySelector(".pos-input-field__field");
        if (amountInput) {
            const amount = parseFloat(amountInput.value.replace(/[^0-9.]/g, ""));
            if (!isNaN(amount)) {
                console.log("📤 Sending order amount:", amount * 100000); // Multiply by 100,000
                sendOrderAmount(amount);
            } else {
                console.error("❌ Invalid order amount.");
            }
        } else {
            console.error("❌ Could not find the order amount field.");
        }
    }
}

// Observe changes in the DOM
const observer = new MutationObserver(() => {
    checkAndSendAmount();
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });

// Also trigger when the payment method changes
document.addEventListener("click", () => {
    setTimeout(checkAndSendAmount, 500);
});
