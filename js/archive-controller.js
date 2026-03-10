// Archive Controller - Manages date navigation across all sections
document.addEventListener("DOMContentLoaded", function () {
  // Only run on past-predictions page
  if (!window.location.pathname.includes("past-predictions.html")) return;

  initializeArchiveController();
});

function initializeArchiveController() {
  // Get all available dates across all sections
  const allDates = getAllAvailableDates();

  // Get current date from URL or use most recent
  const urlParams = new URLSearchParams(window.location.search);
  let currentDate = urlParams.get("date");

  // If no date in URL, use the most recent date
  if (!currentDate && allDates.length > 0) {
    currentDate = allDates[0];
  }

  if (currentDate) {
    // Update display
    document.getElementById("currentDisplayDate").textContent = currentDate;

    // Update all sections to show this date
    updateAllSections(currentDate);

    // Update URL without reloading
    updateURLParameter("date", currentDate);
  }

  // Setup navigation buttons
  setupDateNavigation(allDates, currentDate);
}

function getAllAvailableDates() {
  const dates = new Set();

  // Collect dates from all prediction sources
  if (typeof accaPredictions !== "undefined") {
    accaPredictions.forEach((p) => dates.add(p.date));
  }
  if (typeof cornersPredictions !== "undefined") {
    cornersPredictions.forEach((p) => dates.add(p.date));
  }
  if (typeof smartOddsPredictions !== "undefined") {
    smartOddsPredictions.forEach((p) => dates.add(p.date));
  }
  if (typeof jackpotPredictions !== "undefined") {
    jackpotPredictions.forEach((p) => dates.add(p.date));
  }

  // Convert to array and sort (most recent first)
  return Array.from(dates).sort((a, b) => {
    // Convert "10 Mar 2026" to date for comparison
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });
}

function setupDateNavigation(allDates, currentDate) {
  const prevBtn = document.querySelector(
    "button[onclick=\"navigateDate('prev')\"]",
  );
  const nextBtn = document.querySelector(
    "button[onclick=\"navigateDate('next')\"]",
  );

  // Replace inline onclick with proper event listeners
  if (prevBtn) {
    prevBtn.onclick = () => navigateDate("prev", allDates, currentDate);
  }
  if (nextBtn) {
    nextBtn.onclick = () => navigateDate("next", allDates, currentDate);
  }
}

function navigateDate(direction, allDates, currentDate) {
  const currentIndex = allDates.indexOf(currentDate);
  let newIndex;

  if (direction === "prev" && currentIndex < allDates.length - 1) {
    newIndex = currentIndex + 1;
  } else if (direction === "next" && currentIndex > 0) {
    newIndex = currentIndex - 1;
  } else {
    return; // No more dates in that direction
  }

  const newDate = allDates[newIndex];

  // Update URL and reload to show new date
  window.location.href = `past-predictions.html?date=${encodeURIComponent(newDate)}`;
}

function updateAllSections(date) {
  // Update section date displays
  document.getElementById("acca-date").textContent = `- ${date}`;
  document.getElementById("corners-date").textContent = `- ${date}`;
  document.getElementById("smart-date").textContent = `- ${date}`;
  document.getElementById("jackpot-date").textContent = `- ${date}`;
}

function updateURLParameter(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url);
}
