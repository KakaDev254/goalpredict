// Archive Controller - Manages date navigation across all sections
document.addEventListener("DOMContentLoaded", function () {
  console.log("Archive controller initializing...");

  // Force initialization on past-predictions page
  const isArchivePage = window.location.pathname.includes("past-predictions");

  if (!isArchivePage) {
    console.log("Not on archive page, exiting");
    return;
  }

  console.log("On archive page, initializing...");
  initializeArchiveController();
});

function initializeArchiveController() {
  // Get all available dates
  const allDates = getAllAvailableDates();
  console.log("All dates found:", allDates);

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

  // Get date from URL or use most recent
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

  // Setup navigation buttons
  setupNavigationButtons(allDates, currentDate);
}

function getAllAvailableDates() {
  const dates = new Set();
  console.log("Collecting dates from all prediction sources...");

  // Helper function to safely add dates from a data source
  function addDatesFromSource(dataSource, sourceName) {
    if (
      typeof dataSource !== "undefined" &&
      dataSource &&
      dataSource.length > 0
    ) {
      console.log(`✅ ${sourceName} found:`, dataSource.length, "entries");
      dataSource.forEach((item) => {
        if (item && item.date) {
          dates.add(item.date);
          console.log(`   Added date: ${item.date} from ${sourceName}`);
        }
      });
    } else {
      console.log(`❌ ${sourceName} not found or empty`);
    }
  }

  // Add dates from all sources
  addDatesFromSource(accaPredictions, "accaPredictions");
  addDatesFromSource(cornersPredictions, "cornersPredictions");
  addDatesFromSource(smartOddsPredictions, "smartOddsPredictions");
  addDatesFromSource(jackpotPredictions, "jackpotPredictions");

  // Convert to array
  const datesArray = Array.from(dates);
  console.log("Total unique dates found:", datesArray.length);

  // Sort dates (most recent first)
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
  const prevBtn = document.getElementById("prevDayBtn");
  const nextBtn = document.getElementById("nextDayBtn");

  if (prevBtn) {
    prevBtn.disabled = true;
    prevBtn.classList.add("disabled");
  }
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
  }
}

function setupNavigationButtons(allDates, currentDate) {
  console.log("Setting up navigation buttons...");

  const prevBtn = document.getElementById("prevDayBtn");
  const nextBtn = document.getElementById("nextDayBtn");

  console.log("Prev button found:", prevBtn !== null);
  console.log("Next button found:", nextBtn !== null);

  if (!prevBtn || !nextBtn) {
    console.error("Navigation buttons not found in DOM!");
    return;
  }

  // Remove all existing event listeners by cloning and replacing
  const prevBtnClone = prevBtn.cloneNode(true);
  const nextBtnClone = nextBtn.cloneNode(true);

  prevBtn.parentNode.replaceChild(prevBtnClone, prevBtn);
  nextBtn.parentNode.replaceChild(nextBtnClone, nextBtn);

  // Get fresh references
  const newPrevBtn = document.getElementById("prevDayBtn");
  const newNextBtn = document.getElementById("nextDayBtn");

  // Add new event listeners
  newPrevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    navigateDate("prev", allDates, currentDate);
  });

  newNextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    navigateDate("next", allDates, currentDate);
  });

  // Update button states
  updateButtonStates(allDates, currentDate);
}

function navigateDate(direction, allDates, currentDate) {
  console.log(`Navigating ${direction} from ${currentDate}`);

  // Safety checks
  if (!allDates || !Array.isArray(allDates) || allDates.length === 0) {
    console.error("Cannot navigate: allDates is empty or invalid");
    alert("No dates available for navigation");
    return;
  }

  if (!currentDate) {
    console.error("Cannot navigate: currentDate is undefined");
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

function updateButtonStates(allDates, currentDate) {
  const prevBtn = document.getElementById("prevDayBtn");
  const nextBtn = document.getElementById("nextDayBtn");

  if (!prevBtn || !nextBtn) return;

  const currentIndex = allDates.indexOf(currentDate);

  // Disable prev button if on oldest date
  if (currentIndex >= allDates.length - 1) {
    prevBtn.disabled = true;
    prevBtn.classList.add("disabled");
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove("disabled");
  }

  // Disable next button if on newest date
  if (currentIndex <= 0) {
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
  }
}

// Also check on window load as backup
window.addEventListener("load", function () {
  console.log("Window fully loaded");

  // If we're on archive page but controller didn't run, run it now
  const isArchivePage = window.location.pathname.includes("past-predictions");

  if (isArchivePage && typeof window.archiveInitialized === "undefined") {
    console.log("Late initialization on window load");
    window.archiveInitialized = true;
    initializeArchiveController();
  }
});
