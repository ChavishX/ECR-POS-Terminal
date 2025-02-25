document.addEventListener("DOMContentLoaded", () => {
  const grabButton = document.getElementById("grabData");
  if (grabButton) {
    grabButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
          console.error("❌ No active tab found.");
          return;
        }

        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            const priceElement = document.querySelector(".item_cost");
            const paymentMethod = document.querySelector(".name");

            if (priceElement && paymentMethod && paymentMethod.textContent.trim() === "ECR POS Payment") {
              const totalAmount = parseFloat(priceElement.innerText.replace(/[^0-9.]/g, "")) * 100000;
              chrome.runtime.sendMessage({ action: "sendAmount", totalAmount: totalAmount });
              console.log("📤 Manually grabbed and sent amount:", totalAmount);
            } else {
              console.error("❌ Price element or payment method not found");
            }
          }
        });
      });
    });
  } else {
    console.error("❌ Error: Button with ID 'grabData' not found");
  }
});
