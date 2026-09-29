/* =========================================================
   Toy Heaven - feedback.js
   Handles the star rating, validates the feedback form,
   saves submissions to localStorage, and runs the FAQ
   accordion.
   ========================================================= */

const FEEDBACK_KEY = "toyHeavenFeedback";

let selectedRating = 0;
let stars, ratingStatus, nameInput, emailInput, messageInput, submitBtn, confirmMsg;
let toast, toastMessage, toastTimer;

/* ---------- small pop-up message ---------- */
function showToast(message) {
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.hidden = false;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
    toast.hidden = true;
  }, 3000);
}

/* ---------- star rating ---------- */
function setRating(value) {
  selectedRating = value;

  for (let i = 0; i < stars.length; i++) {
    const starValue = parseInt(stars[i].getAttribute("data-value"), 10);
    const isSelected = starValue <= value;

    stars[i].classList.toggle("selected", isSelected);
    stars[i].setAttribute("aria-checked", isSelected ? "true" : "false");
  }

  if (ratingStatus) {
    ratingStatus.textContent = value === 0
      ? "Tap a star to rate"
      : value + (value === 1 ? " star selected" : " stars selected");
  }
}

/* ---------- validation helpers ---------- */
function showError(inputId, message) {
  const errorEl = document.getElementById(inputId + "-error");
  if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
  const errorEls = document.querySelectorAll(".error");
  for (let i = 0; i < errorEls.length; i++) {
    errorEls[i].textContent = "";
  }
}

function validateFeedbackForm() {
  clearErrors();
  let isValid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (name === "") {
    showError("feedback-name", "Please enter your name.");
    isValid = false;
  }

  if (email === "") {
    showError("feedback-email", "Please enter your email.");
    isValid = false;
  } else {
    const hasAt = email.indexOf("@") > -1;
    const hasDot = email.indexOf(".") > -1;
    if (!hasAt || !hasDot) {
      showError("feedback-email", "Please enter a valid email address.");
      isValid = false;
    }
  }

  if (message === "") {
    showError("feedback-text", "Please enter a message.");
    isValid = false;
  }

  return isValid;
}

/* ---------- storage ---------- */
function saveFeedback(entry) {
  let allFeedback = [];

  try {
    const stored = JSON.parse(localStorage.getItem(FEEDBACK_KEY));
    if (Array.isArray(stored)) allFeedback = stored;
  } catch (e) {
    allFeedback = [];
  }

  allFeedback.push(entry);

  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
  } catch (e) {}
}

/* ---------- submit handler ---------- */
function handleSubmit() {
  const isValid = validateFeedbackForm();

  if (!isValid) {
    if (confirmMsg) confirmMsg.hidden = true;
    showToast("Please fix the highlighted fields.");
    return;
  }

  const entry = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
    rating: selectedRating,
    date: new Date().toISOString()
  };

  saveFeedback(entry);

  if (confirmMsg) confirmMsg.hidden = false;
  showToast("Thanks — your feedback was sent!");

  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
  setRating(0);
}

/* ---------- FAQ accordion ---------- */
function toggleFaq(button) {
  const targetId = button.getAttribute("data-target");
  const answer = document.getElementById(targetId);
  if (!answer) return;

  const isOpen = button.getAttribute("aria-expanded") === "true";

  answer.hidden = isOpen ? true : false;
  button.setAttribute("aria-expanded", isOpen ? "false" : "true");
  button.classList.toggle("open", !isOpen);
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  stars = document.querySelectorAll("#star-rating button");
  ratingStatus = document.getElementById("rating-status");
  nameInput = document.getElementById("feedback-name");
  emailInput = document.getElementById("feedback-email");
  messageInput = document.getElementById("feedback-text");
  submitBtn = document.getElementById("submit-btn");
  confirmMsg = document.getElementById("confirm-msg");
  toast = document.getElementById("toast");
  toastMessage = document.getElementById("toast-message");

  for (let i = 0; i < stars.length; i++) {
    stars[i].addEventListener("click", function () {
      const value = parseInt(this.getAttribute("data-value"), 10);
      setRating(value);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmit);
  }

  const faqButtons = document.querySelectorAll(".faq-question");
  for (let i = 0; i < faqButtons.length; i++) {
    faqButtons[i].addEventListener("click", function () {
      toggleFaq(this);
    });
  }
});