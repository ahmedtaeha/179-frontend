// page-verification.js

const BASE_URL = "https://medicalapi.estulife.com";

$(document).ready(function () {
  const verification_data = JSON.parse(
    localStorage.getItem("verification_data")
  );
  const stored_email = verification_data?.email ? verification_data?.email : "";
  const stored_mobile = verification_data?.mobile
    ? verification_data?.mobile
    : "";
  let em = $("#email");

  let mo = $("#mobile");
  if (stored_email) {
    em.val(stored_email);
    $("#otpEmailFields").show();
    enableEmailVerificationButton();
  }
  if (stored_mobile) {
    mo.val(stored_mobile);
    $("#otpMobileFields").show();
    enableMobileVerificationButton();
  }
  handleOTPInput($("#emailOTP1"), $("#emailOTP2"), null);
  handleOTPInput($("#emailOTP2"), $("#emailOTP3"), $("#emailOTP1"));
  handleOTPInput($("#emailOTP3"), $("#emailOTP4"), $("#emailOTP2"));
  handleOTPInput($("#emailOTP4"), $("#emailOTP5"), $("#emailOTP3"));
  handleOTPInput($("#emailOTP5"), $("#emailOTP6"), $("#emailOTP4"));
  handleOTPInput($("#emailOTP6"), null, $("#emailOTP5"));

  handleOTPInput($("#mobileOTP1"), $("#mobileOTP2"), null);
  handleOTPInput($("#mobileOTP2"), $("#mobileOTP3"), $("#mobileOTP1"));
  handleOTPInput($("#mobileOTP3"), $("#mobileOTP4"), $("#mobileOTP2"));
  handleOTPInput($("#mobileOTP4"), $("#mobileOTP5"), $("#mobileOTP3"));
  handleOTPInput($("#mobileOTP5"), $("#mobileOTP6"), $("#mobileOTP4"));
  handleOTPInput($("#mobileOTP6"), null, $("#mobileOTP5"));

  // Show email OTP fields after entering email
  $("#email").on("input", function () {
    let emailValue = $(this).val().trim();
    console.log(emailValue);
    if (validateEmail(emailValue)) {
      $("#otpEmailFields").show();
      enableEmailVerificationButton();
    } else {
      $("#otpEmailFields").hide();
      disableEmailVerificationButton();
    }
  });

  // Show mobile OTP fields after entering mobile number
  $("#mobile").on("input", function () {
    let mobileValue = $(this).val().trim();

    if (mobileValue === "") {
      return;
    }
    if (mobileValue.length > 10) {
      $(this).val(mobileValue.slice(0, 10));
      return;
    }
    if (validateMobile(mobileValue)) {
      $("#otpMobileFields").show();
      enableMobileVerificationButton();
    } else {
      $("#otpMobileFields").hide();
      disableMobileVerificationButton();
    }
  });
  $("#emailVerificationButton").on("click", function () {
    let email = $("#email").val().trim();
    let emailOTP =
      $("#emailOTP1").val() +
      $("#emailOTP2").val() +
      $("#emailOTP3").val() +
      $("#emailOTP4").val() +
      $("#emailOTP5").val() +
      $("#emailOTP6").val();
    let requestData = {
      email: email,
      emailOtp: emailOTP,
    };
    console.log("api calling", requestData);
    if (!email) {
      return $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please enter your email!");
      });
    } else if (!emailOTP || emailOTP.length !== 6) {
      return $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please enter email otp!");
      });
    }
    verifyEmailApi(requestData);
  });

  $("#mobileVerificationButton").on("click", function () {
    let email = $("#email").val().trim();
    let mobile = $("#mobile").val().trim();
    let mobileOTP =
      $("#mobileOTP1").val() +
      $("#mobileOTP2").val() +
      $("#mobileOTP3").val() +
      $("#mobileOTP4").val() +
      $("#mobileOTP5").val() +
      $("#mobileOTP6").val();
    let requestData = {
      email: email,
      mobileNo: mobile,
      mobileOtp: mobileOTP,
    };
    console.log("calling mobile api", requestData);

    if (!mobileOTP || mobileOTP.length != 6) {
      return $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please enter mobile otp!!");
      });
    } else if (!email) {
      return $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Email must be provided!");
      });
    }
    verifyMobileApi(requestData);
  });
});

function verifyEmailOTP() {
  // Implement email OTP verification logic here
}

function verifyMobileOTP() {
  // Implement mobile OTP verification logic here
}

// Function to validate email format
function validateEmail(email) {
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateMobile(mobile) {
  // Mobile number should not 10 characters
  return mobile.length == 10;
}

// Function to enable/disable email verification button
function enableEmailVerificationButton() {
  $("#emailVerificationButton")
    .prop("disabled", false)
    .attr("style", "cursor:pointer;");
}

function disableEmailVerificationButton() {
  $("#emailVerificationButton")
    .prop("disabled", true)
    .attr("style", "cursor:not-allowed;");
}

// Function to enable/disable mobile verification button
function enableMobileVerificationButton() {
  $("#mobileVerificationButton")
    .prop("disabled", false)
    .removeClass("disabled")
    .attr("style", "cursor:pointer");
}

function disableMobileVerificationButton() {
  $("#mobileVerificationButton")
    .prop("disabled", true)
    .addClass("disabled")
    .attr("style", "cursor:not-allowed");
}

// Function to handle OTP input logic
function handleOTPInput(currentInput, nextInput, prevInput) {
  currentInput.on("input", function () {
    if (nextInput === null) return;
    let otpValue = $(this).val().trim();
    console.log(otpValue);
    if (otpValue !== "") {
      nextInput.focus();
    }
  });

  currentInput.on("keydown", function (e) {
    if (prevInput === null) {
      return;
    }
    if (e.keyCode === 8 && $(this).val().trim() === "") {
      prevInput.focus();
    }
  });
}

function verifyEmailApi(requestData) {
  $.ajax({
    url: BASE_URL + "/api/v1/auth/verify-email",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(requestData),
    success: function (response) {
      // Handle success response
      console.log("Email verification success:", response);
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("success", response?.message);
      });
      $("#email").attr("disabled", true);

      $("#otpEmailFields").hide();
      $("#emailVerificationButton").hide();
    },
    error: function (xhr, status, error) {
      // Handle error response
      let errRes = xhr?.responseJSON;
      console.log(errRes, xhr.status, error);
      if (xhr.status === 403) {
        //already registed email and mobile no.
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("info", errRes.message);
        });
        $("#emailVerifiedIcon").attr(
          "style",
          "display:block;position: absolute; top: 50%; right: 0; transform: translateY(-50%);"
        );

        $("#otpEmailFields").hide();
        $("#emailVerificationButton").hide();
      } else if (xhr.status === 402) {
        // account registered but email not verified and otp may wrong.
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes.message);
        });
      } else if (xhr.status === 401) {
        //user not exist
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes.message);
        });
      }
      console.error("Email verification error:", error);
    },
  });
}

function verifyMobileApi(requestData) {
  $.ajax({
    url: BASE_URL + "/api/v1/auth/verify-mobile",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(requestData),
    success: function (response) {
      // Handle success response
      console.log("Mobile verification success:", response);

      $("#otpMobileFields").hide();
      $("#mobileVerificationButton").hide();
      $("#mobile").attr("disabled", true);
    },
    error: function (xhr, status, error) {
      // Handle error response

      let errRes = xhr?.responseJSON;
      console.error("Mobile verification error:", error);
      if (xhr.status === 403) {
        //already verified mobile no.
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("info", errRes.message + "Please login your account!!");
        });
        $("#mobileVerifiedIcon").attr(
          "style",
          "display:block;position: absolute; top: 50%; right: 0; transform: translateY(-50%);"
        );
      } else if (xhr.status === 402) {
        //  otp may wrong.
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes.message);
        });
      } else if (xhr.status === 401) {
        //mobile not exist
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes.message);
        });
      }
    },
  });
}
