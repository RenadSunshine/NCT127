document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobile menu =====
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ===== Hero slider (only works on home page) =====
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length) {
    const prevBtn = document.getElementById("heroPrev");
    const nextBtn = document.getElementById("heroNext");

    const tagEl = document.getElementById("heroTag");
    const titleEl = document.getElementById("heroTitle");
    const dateEl = document.getElementById("heroDate");
    const placeEl = document.getElementById("heroPlace");

    let index = 0;
    let timer;

    function showSlide(i) {
      slides.forEach((s) => s.classList.remove("hero-slide--active"));
      slides[i].classList.add("hero-slide--active");

      if (tagEl) tagEl.textContent = slides[i].dataset.tag || "";
      if (titleEl) titleEl.textContent = slides[i].dataset.title || "";
      if (dateEl) dateEl.textContent = slides[i].dataset.date || "";
      if (placeEl) placeEl.textContent = slides[i].dataset.place || "";
    }

    function next() {
      index = (index + 1) % slides.length;
      showSlide(index);
    }

    function prev() {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    nextBtn?.addEventListener("click", () => {
      next();
      startAuto();
    });

    prevBtn?.addEventListener("click", () => {
      prev();
      startAuto();
    });

    showSlide(index);
    startAuto();
  }
});

// ===================== COMMON FUNCTIONS =====================

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "👁️‍🗨️";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

function viewEvents() {
  const el = document.getElementById("events");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function searchEvents() {
  const searchDate = document.getElementById("dateSearch")?.value;
  if (!searchDate) return alert("Please select a date to search");
  alert(`Searching for events on: ${new Date(searchDate).toLocaleDateString()}`);
}

function bookEvent(name) {
  alert(`You're about to book: ${name}\nPlease login to complete your booking.`);
  window.location.href = "login.html";
}

// ===================== VALIDATION =====================

// Strict email validation (rejects j.@g.c / name@/name.com / etc.)
function isValidEmail(email) {
  if (/\s/.test(email)) return false;

  const re =
    /^[A-Za-z0-9]+([._%+-]?[A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,24}$/;

  if (!re.test(email)) return false;
  if (email.includes("..")) return false;
  return true;
}

// Strong password: 8+ chars, 1 letter, 1 number, 1 special
function isStrongPassword(password) {
  const hasLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasLength && hasLetter && hasNumber && hasSpecial;
}

// ===================== ERROR MESSAGE =====================

function showError(div, message) {
  if (!div) return;
  div.textContent = message;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 3000);
}

document.addEventListener("input", (e) => {
  if (e.target.matches("input")) {
    const form = e.target.closest("form");
    const errorDiv = form?.querySelector(".error-message");
    if (errorDiv) errorDiv.style.display = "none";
  }
});

// ===================== FORGOT PASSWORD MODAL =====================

function openForgotModal() {
  const modal = document.getElementById("forgotModal");
  const emailInput = document.getElementById("forgotEmail");
  const err = document.getElementById("forgotError");

  if (err) err.style.display = "none";
  if (emailInput) emailInput.value = "";

  modal?.classList.add("show");
  modal?.setAttribute("aria-hidden", "false");
  emailInput?.focus();
}

function closeForgotModal() {
  const modal = document.getElementById("forgotModal");
  modal?.classList.remove("show");
  modal?.setAttribute("aria-hidden", "true");
}

function sendResetLink() {
  const email = document.getElementById("forgotEmail")?.value.trim();
  const err = document.getElementById("forgotError");

  if (!email) return showError(err, "Please enter your email first.");
  if (!isValidEmail(email)) return showError(err, "Your email is not correct. Please try again.");

  // Demo: save requested email
  localStorage.setItem("resetEmail", email);

  closeForgotModal();
  alert("We sent a reset link to your email. (Demo) You will now go to the reset page.");
  window.location.href = "reset-password.html";
}

// ===================== LOGIN =====================

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const errorDiv = document.getElementById("loginError");

  if (!email || !password) return showError(errorDiv, "Please fill in all fields.");
  if (!isValidEmail(email)) return showError(errorDiv, "Your email is not correct. Please try again.");

  // Password rule (your requirement)
  if (!isStrongPassword(password)) {
    return showError(
      errorDiv,
      "Password must be at least 8 characters and include 1 letter, 1 number, and 1 special character."
    );
  }

  // Demo account check (saved from signup / reset)
  const savedEmail = localStorage.getItem("userEmail");
  const savedPassword = localStorage.getItem("userPassword");

  if (!savedEmail || !savedPassword) {
    return showError(errorDiv, "Your email or password is wrong. Please try again.");
  }

  if (email !== savedEmail || password !== savedPassword) {
    return showError(errorDiv, "Your email or password is wrong. Please try again.");
  }

  alert("Login successful! Welcome back to EventGO.");
  window.location.href = "index.html";
}

// ===================== SIGNUP =====================

function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;
  const errorDiv = document.getElementById("signupError");

  if (!name || !email || !password || !confirmPassword) return showError(errorDiv, "Please fill in all fields.");
  if (!isValidEmail(email)) return showError(errorDiv, "Your email is not correct. Please try again.");

  if (!isStrongPassword(password)) {
    return showError(
      errorDiv,
      "Password must be at least 8 characters and include 1 letter, 1 number, and 1 special character."
    );
  }

  if (password !== confirmPassword) return showError(errorDiv, "Passwords do not match.");

  // Save demo account
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userPassword", password);

  alert("Sign up successful! Welcome to EventGO. Please login.");
  window.location.href = "login.html";
}

// ===================== RESET PASSWORD PAGE =====================
// Call this from reset-password.html form: onsubmit="handleResetPassword(event)"

function handleResetPassword(event) {
  event.preventDefault();

  const newPass = document.getElementById("newPassword")?.value || "";
  const confirmPass = document.getElementById("confirmNewPassword")?.value || "";
  const err = document.getElementById("resetError");

  if (!isStrongPassword(newPass)) {
    return showError(
      err,
      "Password must be at least 8 characters and include 1 letter, 1 number, and 1 special character."
    );
  }

  if (newPass !== confirmPass) return showError(err, "Passwords do not match.");

  const oldPass = localStorage.getItem("userPassword");
  if (oldPass && newPass === oldPass) {
    return showError(err, "You cannot use your old password. Please choose a new one.");
  }

  localStorage.setItem("userPassword", newPass);

  alert("Your password has been updated. Please log in with your new password.");
  window.location.href = "login.html";
}