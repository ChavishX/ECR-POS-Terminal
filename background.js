chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendAmount") {
        console.log("📥 Received order amount in background script:", message.totalAmount);

        // Validate the amount
        if (!message.totalAmount || isNaN(message.totalAmount) || message.totalAmount <= 0) {
            console.error("❌ Invalid order amount received:", message.totalAmount);
            sendResponse({ status: "error", message: "Invalid amount" });
            return;
        }

        sendResponse({ status: "success", message: "Amount received successfully" });

        // Forward the amount to the local server
        fetch("http://localhost:5000/api/vi/dosale", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: message.totalAmount }) // Already multiplied by 100,000
        })
        .then(response => response.json())
        .then(data => console.log("✅ Server response:", data))
        .catch(error => console.error("❌ Error sending to server:", error));
    }
    return true; // Keeps the message channel open for async responses
});
