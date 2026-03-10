// Jackpot Hunter JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeJackpot();
});

function initializeJackpot() {
  // Get current page path
  const path = window.location.pathname;
  const isPastPredictionsPage = path.includes("past-predictions.html");

  if (isPastPredictionsPage) {
    renderPastJackpot();
  } else {
    renderTodayJackpot();
  }
}

function renderTodayJackpot() {
  const container = document.getElementById("jackpot-container");

  if (!container) return;

  container.innerHTML = "";

  // Get today's date in the format "10 Mar 2026"
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Find today's predictions
  const todayPredictions = jackpotPredictions.find((p) => p.date === today);

  if (todayPredictions) {
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

  if (!container) return;

  container.innerHTML = "";

  // Get date from URL or use most recent past date
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDate = urlParams.get("date");

  // Find the predictions for selected date or most recent
  let datePredictions;
  let displayDate;

  if (selectedDate) {
    datePredictions = jackpotPredictions.find((p) => p.date === selectedDate);
    displayDate = selectedDate;
  } else {
    // Use the most recent date (first in array)
    datePredictions = jackpotPredictions[0];
    displayDate = datePredictions ? datePredictions.date : null;
  }

  // Add date selector
  addJackpotDateSelector(displayDate);

  if (datePredictions && datePredictions.matches.length > 0) {
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

function addJackpotDateSelector(selectedDate) {
  const section = document.getElementById("jackpot");
  if (!section) return;

  // Check if selector already exists
  let selectorContainer = document.getElementById("jackpot-date-selector");
  if (!selectorContainer) {
    selectorContainer = document.createElement("div");
    selectorContainer.id = "jackpot-date-selector";
    selectorContainer.className = "date-selector mb-3";

    // Insert at the beginning of the section
    const title = section.querySelector("h2");
    title.insertAdjacentElement("afterend", selectorContainer);
  }

  // Create selector HTML
  let selectorHTML = `
    <div class="d-flex align-items-center gap-2">
      <label for="jackpot-date-picker" class="fw-bold">Select Date:</label>
      <select id="jackpot-date-picker" class="form-select form-select-sm" style="width: auto;">
  `;

  // Add all available dates from the data
  jackpotPredictions.forEach((prediction) => {
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
  const datePicker = document.getElementById("jackpot-date-picker");
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
