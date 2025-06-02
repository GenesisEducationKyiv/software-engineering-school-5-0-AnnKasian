document
  .getElementById("subscriptionForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("subscribeButton");
    const loading = document.getElementById("loading");
    const message = document.getElementById("message");
    const form = document.getElementById("subscriptionForm");

    const formData = new FormData(form);
    const data = {
      email: formData.get("email"),
      city: formData.get("city"),
      frequency: formData.get("frequency"),
    };

    submitBtn.disabled = true;
    loading.classList.add("show");
    message.classList.remove("show");

    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        message.className = "message success show";
        message.textContent =
          "Subscription successful! Confirmation email sent.";
        form.reset();
      } else {
        message.className = "message error show";
        message.textContent =
          result.message || "An error occurred. Please try again.";
      }
    } catch (error) {
      message.className = "message error show";
      message.textContent =
        "Network error. Please check your connection and try again.";
    } finally {
      submitBtn.disabled = false;
      loading.classList.remove("show");
    }
  });

const inputs = document.querySelectorAll("input, select");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentNode.style.transform = "scale(1.02)";
    this.parentNode.style.transition = "transform 0.2s ease";
  });

  input.addEventListener("blur", function () {
    this.parentNode.style.transform = "scale(1)";
  });
});
