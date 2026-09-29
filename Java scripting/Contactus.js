

/* =========================================================
   Toy Heaven - Contactus.js
   Validates the Contact Us form, saves submissions to
   localStorage, and shows a small pop-up on success.
   ========================================================= */
 
const CONTACT_KEY = "toyHeavenContactMessages";
 
let firstNameInput, lastNameInput, emailInput, subjectInput, messageInput, submitBtn;
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
 
function isLettersOnly(text) {
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i).toLowerCase();
    const isLetter = ch >= "a" && ch <= "z";
    const isSpace = ch === " ";
    if (!isLetter && !isSpace) return false;
  }
  return true;
}
 
function isValidEmail(email) {
  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");
  const hasSpace = email.indexOf(" ") > -1;
 
  const atExists = atIndex > 0;
  const dotAfterAt = dotIndex > atIndex + 1;
  const dotNotAtEnd = dotIndex < email.length - 1;
 
  return !hasSpace && atExists && dotAfterAt && dotNotAtEnd;
}
 
/* ---------- main validation ---------- */
function validateContactForm() {
  clearErrors();
  let isValid = true;
 
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();
 
  /* ---- first name ---- */
  if (firstName === "") {
    showError("first-name", "Please enter your first name.");
    isValid = false;
  } else if (firstName.length < 2) {
    showError("first-name", "First name must be at least 2 characters.");
    isValid = false;
  } else if (!isLettersOnly(firstName)) {
    showError("first-name", "First name can only contain letters.");
    isValid = false;
  }
 
  /* ---- last name ---- */
  if (lastName === "") {
    showError("last-name", "Please enter your last name.");
    isValid = false;
  } else if (lastName.length < 2) {
    showError("last-name", "Last name must be at least 2 characters.");
    isValid = false;
  } else if (!isLettersOnly(lastName)) {
    showError("last-name", "Last name can only contain letters.");
    isValid = false;
  }
 
  /* ---- email ---- */
  if (email === "") {
    showError("email", "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }
 
  /* ---- subject line ---- */
  if (subject === "") {
    showError("subject", "Please enter a subject for your message.");
    isValid = false;
  } else if (subject.length < 3) {
    showError("subject", "Subject must be at least 3 characters.");
    isValid = false;
  }
 
  /* ---- message body ---- */
  if (message === "") {
    showError("message", "Please write a message.");
    isValid = false;
  } else if (message.length < 10) {
    showError("message", "Please write at least 10 characters.");
    isValid = false;
  }
 
  return isValid;
}
 
/* ---------- storage ---------- */
function saveContactMessage(entry) {
  let allMessages = [];
 
  try {
    const stored = JSON.parse(localStorage.getItem(CONTACT_KEY));
    if (Array.isArray(stored)) allMessages = stored;
  } catch (e) {
    allMessages = [];
  }
 
  allMessages.push(entry);
 
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(allMessages));
  } catch (e) {}
}
 
/* ---------- submit handler ---------- */
function handleContactSubmit() {
  const isValid = validateContactForm();
 
  if (!isValid) {
    showToast("Please fix the highlighted fields.");
    return;
  }
 
  const entry = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim(),
    date: new Date().toISOString()
  };
 
  saveContactMessage(entry);
  showToast("Thanks — your message was sent!");
 
  firstNameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  subjectInput.value = "";
  messageInput.value = "";
}
 
/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  firstNameInput = document.getElementById("first-name");
  lastNameInput = document.getElementById("last-name");
  emailInput = document.getElementById("email");
  subjectInput = document.getElementById("subject");
  messageInput = document.getElementById("message");
  submitBtn = document.getElementById("contact-submit");
  toast = document.getElementById("toast");
  toastMessage = document.getElementById("toast-message");
 
  if (submitBtn) {
    submitBtn.addEventListener("click", handleContactSubmit);
  }
  
});

