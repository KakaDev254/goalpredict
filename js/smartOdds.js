// Smart Odds JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeSmartOdds();
});

function initializeSmartOdds() {
  // Get current page path
  const path = window.location.pathname;
  const isPastPredictionsPage = path.includes("past-predictions");

  if (isPastPredictionsPage) {
    renderPastSmartOdds();
  } else {
    renderTodaySmartOdds();
  }
}

function renderTodaySmartOdds() {
  const container = document.getElementById("smart-container");
  const totalOddsElement = document.getElementById("smart-total");

  if (!container) {
    console.warn("Smart Odds container not found");
    return;
  }

  container.innerHTML = "";

  // Get today's date in the format "11 Mar 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let totalOdds = 1;

  // Find today's predictions
  const todayPredictions = smartOddsPredictions.find((p) => p.date === today);

  if (
    todayPredictions &&
    todayPredictions.matches &&
    todayPredictions.matches.length > 0
  ) {
    todayPredictions.matches.forEach((game) => {
      // Calculate total odds
      totalOdds *= game.odd;

      // Create result icon based on result status
      let resultIcon = "-";
      if (game.result === "win") {
        resultIcon = "<span class='correct'>✔</span>";
      } else if (game.result === "lose") {
        resultIcon = "<span class='failed'>✖</span>";
      } else if (game.result === "pending") {
        resultIcon = "<span class='pending'>⏳</span>";
      }

      // Create row
      container.innerHTML += `
        <div class="table-row">
          <span>${game.match}</span>
          <span>${game.time}</span>
          <span class="tip-badge">${game.tip}</span>
          <span class="odd-value">${game.odd.toFixed(2)}</span>
          <span>${resultIcon}</span>
        </div>
      `;
    });

    // Update total odds
    totalOddsElement.textContent = totalOdds.toFixed(2);
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No predictions available today.
      </div>
    `;
    totalOddsElement.textContent = "0.00";
  }
}

function renderPastSmartOdds() {
  const container = document.querySelector("#smart .table-rows");
  const totalOddsElement = document.getElementById("smart-total");

  if (!container) {
    console.warn("Smart Odds container not found");
    return;
  }

  container.innerHTML = "";

  // Get date from URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDate = urlParams.get("date");

  // Find the predictions for selected date
  let datePredictions = null;

  if (selectedDate) {
    datePredictions = smartOddsPredictions.find((p) => p.date === selectedDate);
  }

  // If no date in URL or date not found, use most recent
  if (!datePredictions && smartOddsPredictions.length > 0) {
    datePredictions = smartOddsPredictions[0];
  }

  if (
    datePredictions &&
    datePredictions.matches &&
    datePredictions.matches.length > 0
  ) {
    let totalOdds = 1;

    datePredictions.matches.forEach((game) => {
      // Calculate total odds
      totalOdds *= game.odd;

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

      // Create row
      container.innerHTML += `
        <div class="table-row ${resultClass}">
          <span>${game.match}</span>
          <span>${game.time}</span>
          <span class="tip-badge">${game.tip}</span>
          <span class="odd-value">${game.odd.toFixed(2)}</span>
          <span>${resultDisplay}</span>
        </div>
      `;
    });

    // Update total odds
    totalOddsElement.textContent = totalOdds.toFixed(2);
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No predictions available for this date.
      </div>
    `;
    totalOddsElement.textContent = "0.00";
  }
}

// REMOVED: addDateSelector function - using global date selector instead
