$(document).ready(function () {
  const BASE_URL = "https://medicalapi.estulife.com";
  const token = localStorage.getItem("clinic_token");
  //   precheck
  if (token) {
    window.location.href = "index.html";
  }

  // Function to handle login
  const loginUser = (email, password) => {
    const apiUrl = BASE_URL + "/api/v1/auth/login";

    const requestData = {
      email: email,
      password: password,
    };

    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: (response) => {
        console.log("Login successful:", response);
        if (response?.data?.token) {
          localStorage.setItem("clinic_token", response?.data?.token);
          localStorage.setItem("user_data", JSON.stringify(response?.data));
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", "Login Success");
            window.location.href = "index.html"; // Redirect to dashboard or other page
          });
        }
      },
      error: (xhr, status, error) => {
        console.error("Login error:", error);
        let errRes = xhr.responseJSON;
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast(
            xhr.status === 403 ? "info" : "error",
            errRes?.message
              ? errRes?.message
              : "Login failed. Please check your credentials and try again."
          );
        });
      },
    });
  };

  $(".theme-form").submit((event) => {
    event.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    // Check if any field is empty
    $("#email, #password").each(function () {
      if ($(this).val() === "" || $(this).val() === null) {
        $(this).addClass("is-invalid");
      } else {
        $(this).removeClass("is-invalid");
      }
    });
    if (email.length && password.length) {
      if (password.length < 6) {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Please enter password with min 6 characters");
        });
        return;
      }
      loginUser(email, password);
    } else {
      setTimeout(() => {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("info", "Please enter both email and password");
        });
      }, [200]);
    }
  });
});
