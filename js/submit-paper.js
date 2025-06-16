// JavaScript for the paper submission form

document.addEventListener("DOMContentLoaded", () => {
  // Set up character counters for textareas
  setupCharacterCounter("author-bio", "bio-char-count", 1000);
  setupCharacterCounter("paper-abstract", "abstract-char-count", 1500);

  // Setup file upload display
  setupFileUpload();

  // Setup form submission
  setupFormSubmission();

  // Setup draft saving
  setupDraftSaving();
});

/**
 * Set up character counter for textarea
 * @param {string} textareaId - ID of the textarea element
 * @param {string} counterId - ID of the counter element
 * @param {number} maxChars - Maximum allowed characters
 */
function setupCharacterCounter(textareaId, counterId, maxChars) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);

  if (!textarea || !counter) return;

  textarea.addEventListener("input", () => {
    const currentLength = textarea.value.length;
    counter.textContent = currentLength;

    // Visual feedback when approaching limit
    if (currentLength >= maxChars * 0.9) {
      counter.style.color = "#dc3545";
    } else {
      counter.style.color = "#777";
    }
  });
}

/**
 * Set up file upload display
 */
function setupFileUpload() {
  const fileInput = document.getElementById("paper-file");
  const fileNameDisplay = document.getElementById("file-name");

  if (!fileInput || !fileNameDisplay) return;

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Check file type
      if (file.type !== "application/pdf") {
        fileNameDisplay.textContent = "Error: Only PDF files are accepted";
        fileNameDisplay.style.color = "#dc3545";
        fileInput.value = ""; // Clear the input
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        fileNameDisplay.textContent = "Error: File size exceeds 10MB limit";
        fileNameDisplay.style.color = "#dc3545";
        fileInput.value = ""; // Clear the input
        return;
      }

      // Display file name
      fileNameDisplay.textContent = file.name;
      fileNameDisplay.style.color = "#333";
    } else {
      fileNameDisplay.textContent = "No file chosen";
      fileNameDisplay.style.color = "#777";
    }
  });
}

/**
 * Set up form submission
 */
function setupFormSubmission() {
  const form = document.getElementById("paper-submission-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // In a real app, you would validate and submit the form data to your server
    // For this demo, we'll just show a success message

    // Create a success notification
    const notification = document.createElement("div");
    notification.className = "success-message";
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.zIndex = "1000";
    notification.style.padding = "15px 25px";
    notification.style.borderRadius = "6px";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.gap = "10px";

    notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Your paper has been submitted successfully! It will be reviewed by our editorial team.</p>
        `;

    document.body.appendChild(notification);

    // Remove the notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);

      // In a real app, you might redirect the user or reset the form
      form.reset();
    }, 5000);
  });
}

/**
 * Set up draft saving
 */
function setupDraftSaving() {
  const saveButton = document.getElementById("save-draft");
  const form = document.getElementById("paper-submission-form");

  if (!saveButton || !form) return;

  // Load any existing draft data
  loadDraftData();

  saveButton.addEventListener("click", () => {
    // Collect form data
    const formData = {
      firstName: document.getElementById("author-first-name").value,
      lastName: document.getElementById("author-last-name").value,
      email: document.getElementById("author-email").value,
      institution: document.getElementById("author-institution").value,
      bio: document.getElementById("author-bio").value,
      title: document.getElementById("paper-title").value,
      category: document.getElementById("paper-category").value,
      keywords: document.getElementById("paper-keywords").value,
      abstract: document.getElementById("paper-abstract").value,
      coverLetter: document.getElementById("cover-letter").value,
      savedDate: new Date().toISOString(),
    };

    // Save to local storage
    localStorage.setItem("paperSubmissionDraft", JSON.stringify(formData));

    // Show confirmation
    const notification = document.createElement("div");
    notification.className = "success-message";
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.zIndex = "1000";
    notification.style.padding = "15px 25px";
    notification.style.borderRadius = "6px";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.gap = "10px";

    notification.innerHTML = `
            <i class="fas fa-save"></i>
            <p>Draft saved! You can return to complete your submission later.</p>
        `;

    document.body.appendChild(notification);

    // Remove the notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  });
}

/**
 * Load draft data from local storage
 */
function loadDraftData() {
  const savedDraft = localStorage.getItem("paperSubmissionDraft");

  if (!savedDraft) return;

  try {
    const draftData = JSON.parse(savedDraft);

    // Check if the draft is recent (less than 7 days old)
    const savedDate = new Date(draftData.savedDate);
    const currentDate = new Date();
    const daysDifference = (currentDate - savedDate) / (1000 * 60 * 60 * 24);

    if (daysDifference > 7) {
      // Draft is old, remove it
      localStorage.removeItem("paperSubmissionDraft");
      return;
    }

    // Ask if user wants to load the draft
    const loadDraft = confirm(
      `You have a saved draft from ${formatDate(
        draftData.savedDate
      )}. Would you like to load it?`
    );

    if (loadDraft) {
      // Fill the form with draft data
      if (draftData.firstName)
        document.getElementById("author-first-name").value =
          draftData.firstName;
      if (draftData.lastName)
        document.getElementById("author-last-name").value = draftData.lastName;
      if (draftData.email)
        document.getElementById("author-email").value = draftData.email;
      if (draftData.institution)
        document.getElementById("author-institution").value =
          draftData.institution;
      if (draftData.bio)
        document.getElementById("author-bio").value = draftData.bio;
      if (draftData.title)
        document.getElementById("paper-title").value = draftData.title;
      if (draftData.category)
        document.getElementById("paper-category").value = draftData.category;
      if (draftData.keywords)
        document.getElementById("paper-keywords").value = draftData.keywords;
      if (draftData.abstract)
        document.getElementById("paper-abstract").value = draftData.abstract;
      if (draftData.coverLetter)
        document.getElementById("cover-letter").value = draftData.coverLetter;

      // Trigger character counters
      const bioTextarea = document.getElementById("author-bio");
      const abstractTextarea = document.getElementById("paper-abstract");

      if (bioTextarea) {
        bioTextarea.dispatchEvent(new Event("input"));
      }

      if (abstractTextarea) {
        abstractTextarea.dispatchEvent(new Event("input"));
      }
    } else {
      // User declined to load draft, remove it
      localStorage.removeItem("paperSubmissionDraft");
    }
  } catch (error) {
    console.error("Error loading draft data:", error);
    localStorage.removeItem("paperSubmissionDraft");
  }
}
