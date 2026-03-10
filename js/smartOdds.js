// Smart Odds JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeSmartOdds();
});

function initializeSmartOdds() {
  // Get current page path
  const path = window.location.pathname;
  const isPastPredictionsPage = path.includes("past-predictions.html");

  if (isPastPredictionsPage) {
    renderPastSmartOdds();
  } else {
    renderTodaySmartOdds();
  }
}

function renderTodaySmartOdds() {
  const container = document.getElementById("smart-container");
  const totalOddsElement = document.getElementById("smart-total");

  if (!container) return;

  container.innerHTML = "";

  // Get today's date in the format "10 Mar 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let totalOdds = 1;

  // Find today's predictions
  const todayPredictions = smartOddsPredictions.find((p) => p.date === today);

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

  if (!container) return;

  container.innerHTML = "";

  // Get date from URL or use most recent past date
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDate = urlParams.get("date");

  // Find the predictions for selected date or most recent
  let datePredictions;
  let displayDate;

  if (selectedDate) {
    datePredictions = smartOddsPredictions.find((p) => p.date === selectedDate);
    displayDate = selectedDate;
  } else {
    // Use the most recent date (first in array)
    datePredictions = smartOddsPredictions[0];
    displayDate = datePredictions ? datePredictions.date : null;
  }

  // Add date selector
  addDateSelector(displayDate);

  if (datePredictions && datePredictions.matches.length > 0) {
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

function addDateSelector(selectedDate) {
  const section = document.getElementById("smart");
  if (!section) return;

  // Check if selector already exists
  let selectorContainer = document.getElementById("smart-date-selector");
  if (!selectorContainer) {
    selectorContainer = document.createElement("div");
    selectorContainer.id = "smart-date-selector";
    selectorContainer.className = "date-selector mb-3";

    // Insert at the beginning of the section
    const title = section.querySelector("h2");
    title.insertAdjacentElement("afterend", selectorContainer);
  }

  // Create selector HTML
  let selectorHTML = `
    <div class="d-flex align-items-center gap-2">
      <label for="smart-date-picker" class="fw-bold">Select Date:</label>
      <select id="smart-date-picker" class="form-select form-select-sm" style="width: auto;">
  `;

  // Add all available dates from the data
  smartOddsPredictions.forEach((prediction) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const isToday = prediction.date === today;
    const displayText = isToday
      ? `${prediction.date} (Today)`
      : prediction.date;
    const selected = prediction.date === selectedDate ? "selected" : "";

    selectorHTML += `<option value="${prediction.date}" ${selected}>${displayText}</option>`;
  });

  selectorHTML += `
      </select>
    </div>
  `;

  selectorContainer.innerHTML = selectorHTML;

  // Add event listener
  const datePicker = document.getElementById("smart-date-picker");
  if (datePicker) {
    datePicker.addEventListener("change", function (e) {
      const newDate = e.target.value;
      // Update URL and reload data
      const url = new URL(window.location.href);
      url.searchParams.set("date", newDate);
      window.location.href = url.toString();
    });
  }
}
