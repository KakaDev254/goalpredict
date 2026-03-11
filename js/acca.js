// Daily Acca JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeAcca();
});

function initializeAcca() {
  // Get current page path
  const path = window.location.pathname;
  const isPastPredictionsPage = path.includes("past-predictions");

  if (isPastPredictionsPage) {
    renderPastAcca();
  } else {
    renderTodayAcca();
  }
}

function renderTodayAcca() {
  const container = document.getElementById("acca-table");
  const totalOddsElement = document.getElementById("acca-total");

  if (!container) return;

  container.innerHTML = "";

  // Get today's date in the format "11 Mar 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let totalOdds = 1;

  // Find today's predictions
  const todayPredictions = accaPredictions.find((p) => p.date === today);

  if (todayPredictions) {
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

function renderPastAcca() {
  const container = document.querySelector("#acca .table-rows");
  const totalOddsElement = document.getElementById("acca-total");

  if (!container) return;

  container.innerHTML = "";

  // Get date from URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDate = urlParams.get("date");

  // Find the predictions for selected date
  let datePredictions = null;

  if (selectedDate) {
    datePredictions = accaPredictions.find((p) => p.date === selectedDate);
  }

  // If no date in URL or date not found, use most recent
  if (!datePredictions && accaPredictions.length > 0) {
    datePredictions = accaPredictions[0];
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

// REMOVED: addAccaDateSelector function - we're using global date selector instead

// Function to calculate total odds for acca
function calculateAccaTotalOdds(matches) {
  if (!matches || matches.length === 0) return "0.00";
  return matches.reduce((total, match) => total * match.odd, 1).toFixed(2);
}
