// Main JavaScript file for the History Journal website

// Set current year in the footer
document.addEventListener("DOMContentLoaded", () => {
  const currentYearElements = document.querySelectorAll("#current-year");
  const currentYear = new Date().getFullYear();

  currentYearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  // Mobile hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close the mobile menu when a link is clicked
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Scroll to top button
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.className = "scroll-top-btn";
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 99;
        transition: all 0.3s ease;
    `;

  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "flex";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

/**
 * Format a date as a readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Truncate text to a certain length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {HTMLElement} container - Container to display the error in
 */
function showError(message, container) {
  container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Display success message
 * @param {string} message - Success message to display
 * @param {HTMLElement} container - Container to display the success message in
 */
function showSuccess(message, container) {
  container.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Create a star rating display
 * @param {number} rating - Rating value (1-5)
 * @returns {string} - HTML for star rating
 */
function createStarRating(rating) {
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star star"></i>';
    } else if (i - 0.5 <= rating) {
      stars += '<i class="fas fa-star-half-alt star"></i>';
    } else {
      stars += '<i class="far fa-star star"></i>';
    }
  }

  return stars;
}
