// Archive Controller - Manages date navigation across all sections
document.addEventListener("DOMContentLoaded", function () {
  console.log("Archive controller initializing...");

  // Check if we're on past-predictions page - IMPROVED CHECK
  const path = window.location.pathname;
  console.log("Current path:", path);

  // More flexible check for archive page
  const isArchivePage =
    path.includes("past-predictions") ||
    path.includes("past-predictions.html") ||
    document.getElementById("currentDisplayDate") !== null;

  console.log("Is archive page?", isArchivePage);

  if (!isArchivePage) {
    console.log("Not on archive page, exiting");
    return;
  }

  console.log("On archive page, initializing...");
  initializeArchiveController();
});

function initializeArchiveController() {
  console.log("Initializing archive controller...");

  // Get all available dates across all sections
  const allDates = getAllAvailableDates();
  console.log("All available dates:", allDates);

  if (!allDates || allDates.length === 0) {
    console.error("No dates found in any prediction data!");

    // Show error message on page
    const displayElement = document.getElementById("currentDisplayDate");
    if (displayElement) {
      displayElement.textContent = "No predictions found";
    }

    // Disable navigation buttons
    disableNavigationButtons();
    return;
  }

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
  }

  // Setup navigation buttons with proper parameters
  setupDateNavigation(allDates, currentDate);
}

function getAllAvailableDates() {
  const dates = new Set();
  console.log("Collecting dates from all prediction sources...");

  // Collect dates from all prediction sources with error checking
  if (
    typeof accaPredictions !== "undefined" &&
    accaPredictions &&
    accaPredictions.length > 0
  ) {
    console.log("✅ accaPredictions found:", accaPredictions.length, "entries");
    accaPredictions.forEach((p) => {
      if (p && p.date) dates.add(p.date);
    });
  } else {
    console.warn("⚠️ accaPredictions is not defined or is empty");
  }

  if (
    typeof cornersPredictions !== "undefined" &&
    cornersPredictions &&
    cornersPredictions.length > 0
  ) {
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

  if (
    typeof smartOddsPredictions !== "undefined" &&
    smartOddsPredictions &&
    smartOddsPredictions.length > 0
  ) {
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

  if (
    typeof jackpotPredictions !== "undefined" &&
    jackpotPredictions &&
    jackpotPredictions.length > 0
  ) {
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
      // Convert "DD MMM YYYY" to Date object for comparison
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA; // Most recent first
    } catch (e) {
      console.error("Error sorting dates:", e);
      return 0;
    }
  });
}

function disableNavigationButtons() {
  const prevBtn = document.querySelector('button[onclick*="prev"]');
  const nextBtn = document.querySelector('button[onclick*="next"]');

  if (prevBtn) {
    prevBtn.disabled = true;
    prevBtn.classList.add("disabled");
  }
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
  }
}

function setupDateNavigation(allDates, currentDate) {
  console.log("Setting up date navigation...");
  console.log("allDates:", allDates);
  console.log("currentDate:", currentDate);

  // Get buttons - IMPROVED SELECTOR
  const prevBtn = document.querySelector('button[onclick*="prev"]');
  const nextBtn = document.querySelector('button[onclick*="next"]');

  console.log("Prev button found:", prevBtn !== null);
  console.log("Next button found:", nextBtn !== null);

  // Remove existing onclick attributes and add new ones
  if (prevBtn) {
    prevBtn.onclick = null; // Remove old handler
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigateDate("prev", allDates, currentDate);
    });
  }

  if (nextBtn) {
    nextBtn.onclick = null; // Remove old handler
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigateDate("next", allDates, currentDate);
    });
  }
}

function navigateDate(direction, allDates, currentDate) {
  console.log(`Navigating ${direction} from ${currentDate}`);
  console.log("allDates:", allDates);
  console.log("currentDate:", currentDate);

  // Safety checks
  if (!allDates || !Array.isArray(allDates) || allDates.length === 0) {
    console.error("Cannot navigate: allDates is empty or invalid", allDates);
    alert("No dates available for navigation");
    return;
  }

  if (!currentDate) {
    console.error("Cannot navigate: currentDate is", currentDate);
    // Try to use the first date as fallback
    if (allDates.length > 0) {
      currentDate = allDates[0];
      console.log(`Using fallback date: ${currentDate}`);
    } else {
      alert("No current date selected");
      return;
    }
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

// Also check on window load as backup
window.addEventListener("load", function () {
  console.log("Window fully loaded");

  // If we're on archive page but controller didn't run, run it now
  const isArchivePage =
    window.location.pathname.includes("past-predictions") ||
    document.getElementById("currentDisplayDate") !== null;

  if (isArchivePage && typeof window.archiveInitialized === "undefined") {
    console.log("Late initialization on window load");
    window.archiveInitialized = true;
    initializeArchiveController();
  }
});
