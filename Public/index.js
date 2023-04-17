const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const openSignupButtons = document.querySelectorAll("[data-modal-target]");
const closeSignupButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openSignupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const signupform = document.querySelector(button.dataset.signupTarget);
    openSignup(signupform);
  });
});

closeSignupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const signupform = button.closest(".signupform");
    closeSignup(signupform);
    overlay.classList.remove("active");
  });
});

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
    overlay.classList.add("active");
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function openSignup(signupform) {
  if (signupform == null) return;
  signupform.classList.add("active");
  overlay.classList.add("active");
}
function closeSignup(signupform) {
  if (signupform == null) return;
  signupform.classList.remove("active");
  overlay.classList.remove("active");
}
