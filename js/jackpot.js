// Jackpot Hunter JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeJackpot();
});

function initializeJackpot() {
  // Get current page path
  const path = window.location.pathname;
  const isPastPredictionsPage = path.includes("past-predictions");

  if (isPastPredictionsPage) {
    renderPastJackpot();
  } else {
    renderTodayJackpot();
  }
}

function renderTodayJackpot() {
  const container = document.getElementById("jackpot-container");

  if (!container) {
    console.warn("Jackpot container not found");
    return;
  }

  container.innerHTML = "";

  // Get today's date in the format "11 Mar 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  console.log("Today's date for jackpot:", today);

  // Find today's predictions
  const todayPredictions = jackpotPredictions.find((p) => p.date === today);

  if (
    todayPredictions &&
    todayPredictions.matches &&
    todayPredictions.matches.length > 0
  ) {
    todayPredictions.matches.forEach((game) => {
      // Create result icon based on result status
      let resultIcon = "-";
      if (game.result === "win") {
        resultIcon = "<span class='correct'>✔</span>";
      } else if (game.result === "lose") {
        resultIcon = "<span class='failed'>✖</span>";
      } else if (game.result === "pending") {
        resultIcon = "<span class='pending'>⏳</span>";
      }

      // Create row (without odds column)
      container.innerHTML += `
        <div class="table-row jackpot-row">
          <span>${game.match}</span>
          <span>${game.time}</span>
          <span class="tip-badge">${game.tip}</span>
          <span>${resultIcon}</span>
        </div>
      `;
    });
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No jackpot predictions available today.
      </div>
    `;
  }
}

function renderPastJackpot() {
  const container = document.querySelector("#jackpot .table-rows");

  if (!container) {
    console.warn("Jackpot container not found");
    return;
  }

  container.innerHTML = "";

  // Get date from URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDate = urlParams.get("date");

  console.log("Selected date for jackpot:", selectedDate);

  // Find the predictions for selected date
  let datePredictions = null;

  if (selectedDate) {
    datePredictions = jackpotPredictions.find((p) => p.date === selectedDate);
  }

  // If no date in URL or date not found, use most recent
  if (!datePredictions && jackpotPredictions.length > 0) {
    datePredictions = jackpotPredictions[0];
    console.log("Using most recent jackpot date:", datePredictions.date);
  }

  if (
    datePredictions &&
    datePredictions.matches &&
    datePredictions.matches.length > 0
  ) {
    datePredictions.matches.forEach((game) => {
      // Create result display based on result status
      let resultDisplay = "-";
      let resultClass = "";

      if (game.result === "win") {
        resultDisplay = "<span class='correct'>✔ Win</span>";
        resultClass = "result-win";
      } else if (game.result === "lose") {
        resultDisplay = "<span class='failed'>✖ Lose</span>";
        resultClass = "result-lose";
      } else if (game.result === "pending") {
        resultDisplay = "<span class='pending'>⏳ Pending</span>";
        resultClass = "result-pending";
      }

      // Create row (without odds column)
      container.innerHTML += `
        <div class="table-row jackpot-row ${resultClass}">
          <span>${game.match}</span>
          <span>${game.time}</span>
          <span class="tip-badge">${game.tip}</span>
          <span>${resultDisplay}</span>
        </div>
      `;
    });
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No jackpot predictions available for this date.
      </div>
    `;
  }
}

// REMOVED: addJackpotDateSelector function - using global date selector instead
