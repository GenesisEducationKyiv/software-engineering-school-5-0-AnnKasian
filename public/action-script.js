const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const action = urlParams.get("action");

async function processAction() {
  if (!token || !action) {
    showError("Invalid link. Missing required parameters.");
    return;
  }

  try {
    let endpoint;
    let actionText;
    let actionClass;

    if (action === "confirm") {
      endpoint = `/confirm/${token}`;
      actionText = "Confirmation";
      actionClass = "confirm-action";
    } else if (action === "unsubscribe") {
      endpoint = `/unsubscribe/${token}`;
      actionText = "Unsubscription";
      actionClass = "unsubscribe-action";
    } else {
      showError("Invalid action specified.");
      return;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess(result, actionText, actionClass);
    } else {
      showError(
        result.message || "An error occurred while processing your request."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Network error. Please check your connection and try again.");
  }
}

function showSuccess(result, actionText, actionClass) {
  const content = `
          <div class="success-icon">✅</div>
          <span class="action-type ${actionClass}">${actionText}</span>
          <h1>Success!</h1>
          <p>${result.message}</p>
        `;
  showResult(content);
}

function showError(message) {
  const content = `
          <div class="error-icon">❌</div>
          <h1>Oops! Something went wrong</h1>
          <p>${message}</p>
        `;
  showResult(content);
}

function showResult(content) {
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("resultContent").innerHTML = content;
  document.getElementById("resultState").classList.add("show");
}

window.addEventListener("load", processAction);
