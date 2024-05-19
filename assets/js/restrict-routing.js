$(document).ready(function () {
  // console.log("bharat");
  // Get the clinic_token from localStorage
  const clinicToken = localStorage.getItem("clinic_token");

  // Array of restricted pages
  const restrictedPages = [
    "page-error-500.html",
    "page-error-404.html",
    "page-forgot-password.html",
    "page-lock-screen.html",
    "page-login-one.html",
    "page-login.html",
    "page-register-one.html",
    "page-register.html",
    "page-verification.html",
  ];

  // Get the current page filename
  const currentPage = window.location.pathname.split("/").pop();
  // console.log(currentPage);

  // Check if the user has a clinic_token
  if (!clinicToken) {
    // If no token and the current page is not in restrictedPages array, redirect to login page
    if (!restrictedPages.includes(currentPage)) {
      window.location.href = "page-login.html";
    }
  } else {
    // If there's a token and the current page is one of the restricted pages, redirect to home page
    if (restrictedPages.includes(currentPage)) {
      window.location.href = "index.html"; //dashboard
    }
  }
});
