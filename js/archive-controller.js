// Archive Controller - Manages date navigation across all sections
document.addEventListener("DOMContentLoaded", function () {
  console.log("Archive controller initializing...");

  // Only run on past-predictions page
  if (!window.location.pathname.includes("past-predictions.html")) {
    console.log("Not on archive page, exiting");
    return;
  }

  initializeArchiveController();
});

function initializeArchiveController() {
  console.log("Initializing archive controller...");

  // Get all available dates across all sections
  const allDates = getAllAvailableDates();
  console.log("All available dates:", allDates);

  // Get current date from URL or use most recent
  const urlParams = new URLSearchParams(window.location.search);
  let currentDate = urlParams.get("date");
  console.log("Date from URL:", currentDate);

  // If no date in URL, use the most recent date
  if (!currentDate && allDates.length > 0) {
    currentDate = allDates[0];
    console.log("Using most recent date:", currentDate);
  }

  if (currentDate) {
    // Update display
    const displayElement = document.getElementById("currentDisplayDate");
    if (displayElement) {
      displayElement.textContent = currentDate;
    }

    // Update all sections to show this date
    updateAllSections(currentDate);

    // Update URL without reloading
    updateURLParameter("date", currentDate);
  } else {
    console.warn("No dates available!");
    const displayElement = document.getElementById("currentDisplayDate");
    if (displayElement) {
      displayElement.textContent = "No predictions available";
    }
  }

  // Setup navigation buttons
  setupDateNavigation(allDates, currentDate);
}

function getAllAvailableDates() {
  const dates = new Set();
  console.log("Collecting dates from all prediction sources...");

  // Collect dates from all prediction sources with error checking
  if (typeof accaPredictions !== "undefined" && accaPredictions) {
    console.log("✅ accaPredictions found:", accaPredictions.length, "entries");
    accaPredictions.forEach((p) => {
      if (p && p.date) dates.add(p.date);
    });
  } else {
    console.warn("⚠️ accaPredictions is not defined or is empty");
  }

  if (typeof cornersPredictions !== "undefined" && cornersPredictions) {
    console.log(
      "✅ cornersPredictions found:",
      cornersPredictions.length,
      "entries",
    );
    cornersPredictions.forEach((p) => {
      if (p && p.date) dates.add(p.date);
    });
  } else {
    console.warn("⚠️ cornersPredictions is not defined or is empty");
  }

  if (typeof smartOddsPredictions !== "undefined" && smartOddsPredictions) {
    console.log(
      "✅ smartOddsPredictions found:",
      smartOddsPredictions.length,
      "entries",
    );
    smartOddsPredictions.forEach((p) => {
      if (p && p.date) dates.add(p.date);
    });
  } else {
    console.warn("⚠️ smartOddsPredictions is not defined or is empty");
  }

  if (typeof jackpotPredictions !== "undefined" && jackpotPredictions) {
    console.log(
      "✅ jackpotPredictions found:",
      jackpotPredictions.length,
      "entries",
    );
    jackpotPredictions.forEach((p) => {
      if (p && p.date) dates.add(p.date);
    });
  } else {
    console.warn("⚠️ jackpotPredictions is not defined or is empty");
  }

  // Convert to array and sort (most recent first)
  const datesArray = Array.from(dates);
  console.log("Total unique dates found:", datesArray.length);

  // Sort dates (assuming format "DD MMM YYYY" like "11 Mar 2026")
  return datesArray.sort((a, b) => {
    try {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA; // Most recent first
    } catch (e) {
      console.error("Error sorting dates:", e);
      return 0;
    }
  });
}

function setupDateNavigation(allDates, currentDate) {
  console.log("Setting up date navigation...");

  // Safety check
  if (!allDates || allDates.length === 0) {
    console.warn("No dates available for navigation");
    return;
  }

  if (!currentDate) {
    console.warn("No current date selected");
    return;
  }

  // Get buttons
  const prevBtn = document.querySelector(
    "button[onclick=\"navigateDate('prev')\"]",
  );
  const nextBtn = document.querySelector(
    "button[onclick=\"navigateDate('next')\"]",
  );

  // Replace inline onclick with proper event listeners
  if (prevBtn) {
    prevBtn.onclick = function () {
      navigateDate("prev", allDates, currentDate);
    };
    console.log("Previous button configured");
  } else {
    console.warn("Previous button not found");
  }

  if (nextBtn) {
    nextBtn.onclick = function () {
      navigateDate("next", allDates, currentDate);
    };
    console.log("Next button configured");
  } else {
    console.warn("Next button not found");
  }
}

function navigateDate(direction, allDates, currentDate) {
  console.log(`Navigating ${direction} from ${currentDate}`);

  // Safety checks
  if (!allDates || !Array.isArray(allDates) || allDates.length === 0) {
    console.error("Cannot navigate: allDates is empty or invalid", allDates);
    alert("No dates available for navigation");
    return;
  }

  if (!currentDate) {
    console.error("Cannot navigate: currentDate is", currentDate);
    alert("No current date selected");
    return;
  }

  const currentIndex = allDates.indexOf(currentDate);
  console.log(`Current index: ${currentIndex} of ${allDates.length - 1}`);

  if (currentIndex === -1) {
    console.error(`Date "${currentDate}" not found in allDates:`, allDates);
    // Try to use the first date as fallback
    if (allDates.length > 0) {
      const newDate = allDates[0];
      console.log(`Falling back to first date: ${newDate}`);
      window.location.href = `past-predictions.html?date=${encodeURIComponent(newDate)}`;
    }
    return;
  }

  let newIndex;
  if (direction === "prev" && currentIndex < allDates.length - 1) {
    newIndex = currentIndex + 1;
  } else if (direction === "next" && currentIndex > 0) {
    newIndex = currentIndex - 1;
  } else {
    console.log(`No more dates in ${direction} direction`);
    alert(
      `No ${direction === "prev" ? "older" : "newer"} predictions available`,
    );
    return;
  }

  const newDate = allDates[newIndex];
  console.log(`Navigating to: ${newDate} (index ${newIndex})`);

  // Update URL and reload to show new date
  window.location.href = `past-predictions.html?date=${encodeURIComponent(newDate)}`;
}

function updateAllSections(date) {
  console.log(`Updating all sections to show date: ${date}`);

  // Update section date displays
  const accaDateEl = document.getElementById("acca-date");
  const cornersDateEl = document.getElementById("corners-date");
  const smartDateEl = document.getElementById("smart-date");
  const jackpotDateEl = document.getElementById("jackpot-date");

  if (accaDateEl) accaDateEl.textContent = `- ${date}`;
  if (cornersDateEl) cornersDateEl.textContent = `- ${date}`;
  if (smartDateEl) smartDateEl.textContent = `- ${date}`;
  if (jackpotDateEl) jackpotDateEl.textContent = `- ${date}`;

  // Update mobile date display if it exists
  updateMobileDateDisplay(date);
}

function updateMobileDateDisplay(date) {
  const mobileDateElement = document.getElementById("mobileCurrentDate");
  if (mobileDateElement) {
    mobileDateElement.textContent = date;
    mobileDateElement.classList.remove("loading");
  }
}

function updateURLParameter(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url);
}

// Add this to check if data is loading properly
window.addEventListener("load", function () {
  console.log("Page fully loaded");
  console.log(
    "accaPredictions defined:",
    typeof accaPredictions !== "undefined",
  );
  console.log(
    "cornersPredictions defined:",
    typeof cornersPredictions !== "undefined",
  );
  console.log(
    "smartOddsPredictions defined:",
    typeof smartOddsPredictions !== "undefined",
  );
  console.log(
    "jackpotPredictions defined:",
    typeof jackpotPredictions !== "undefined",
  );
});
