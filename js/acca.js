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

  // If the container doesn't exist on this page, stop.
  if (!container) return;

  container.innerHTML = "";

  // Get today's date in the format "17 Sep 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let totalOdds = 1;

  // 1. Try to find exactly today's predictions
  let todayPredictions = accaPredictions.find((p) => p.date === today);

  // 2. Fallback: If no exact match for today, show the first upcoming match (e.g., 17 Sep 2026)
  if (!todayPredictions && accaPredictions.length > 0) {
    todayPredictions = accaPredictions[0];
  }

  if (todayPredictions && todayPredictions.matches.length > 0) {
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
    if (totalOddsElement) {
      totalOddsElement.textContent = totalOdds.toFixed(2);
    }
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No predictions available today.
      </div>
    `;
    if (totalOddsElement) {
      totalOddsElement.textContent = "0.00";
    }
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

  let datePredictions = null;

  // 1. Try to find the exact date from the URL
  if (selectedDate) {
    datePredictions = accaPredictions.find((p) => p.date === selectedDate);
  }

  // 2. If no date in URL, find the most recent PAST date
  if (!datePredictions && accaPredictions.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    // Sort by date descending, then find the first one that is before today
    const pastDates = accaPredictions
      .map((p) => ({ ...p, parsedDate: new Date(p.date) }))
      .filter((p) => p.parsedDate < today)
      .sort((a, b) => b.parsedDate - a.parsedDate); // Newest first

    if (pastDates.length > 0) {
      datePredictions = pastDates[0];
    }
  }

  // 3. Render if we found valid data
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
    if (totalOddsElement) {
      totalOddsElement.textContent = totalOdds.toFixed(2);
    }
  } else {
    container.innerHTML = `
      <div class="no-predictions">
        No past predictions available.
      </div>
    `;
    if (totalOddsElement) {
      totalOddsElement.textContent = "0.00";
    }
  }
}

// Function to calculate total odds for acca
function calculateAccaTotalOdds(matches) {
  if (!matches || matches.length === 0) return "0.00";
  return matches.reduce((total, match) => total * match.odd, 1).toFixed(2);
}