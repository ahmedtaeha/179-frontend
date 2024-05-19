const BASE_URL = "https://medicalapi.estulife.com";

function showPreviewSignUp(event) {
  const input = event.target;
  const file = input.files[0];
  const preview = $("#file-signup-1-preview");

  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      preview.attr("src", reader.result);
    };

    reader.readAsDataURL(file);
  } else {
    // If no file is selected, show a default image
    preview.attr("src", "assets/images/avatar-project_logo.webp");
  }
}

$("#file-signup-1-preview").click(function () {
  $("#file-signup-1").click();
});

let imageKey = null; // Variable to store the image key
//let imageKey = bharatrandomimagekey86595695

// Handle change event of file input for image upload
$("#file-signup-1").change(function () {
  const file = $(this)[0].files[0];
  console.log("bharat");
  if (file) {
    // If a file is selected, upload it using the image upload API
    const formData = new FormData();
    formData.append("file", file);

    $.ajax({
      url: BASE_URL + "/api/v1/public/upload",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log("Image uploaded successfully:", response);
        imageKey = response?.data?.key; // Store the image key
      },
      error: function (xhr, status, error) {
        console.error("Error uploading image:", error);
      },
    });
  }
});

$(document).ready(function () {
  $("#userRegistrationForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission
    console.log(BASE_URL);

    let checkbox = $("#userRegistrationForm input[name='checkbox']").prop(
      "checked"
    );
    let firstName = $("#userRegistrationForm input[name='firstName']").val();
    let lastName = $("#userRegistrationForm input[name='lastName']").val();
    let email = $("#userRegistrationForm input[name='email']").val();
    let password = $("#userRegistrationForm input[name='password']").val();

    let userRole = $("#userRegistrationForm select[name='userRole']").val();
    let gender = $("#userRegistrationForm select[name='gender']").val();
    let languages = $("#userRegistrationForm select[name='languages']").val();

    let mobileNo = $("#userRegistrationForm input[name='mobileNo']").val();
    let address = $("#userRegistrationForm input[name='address']").val();
    let bio = $("#userRegistrationForm input[name='bio']").val();
    let countryCode = $("#userRegistrationForm select[id='countryCode']").val();
    if (!imageKey) {
      imageKey = "bharatrandomimagekey86595695";
    }
    if (!countryCode) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "please select country code!");
      });
      return;
    }

    // Check if any field is empty
    $("#userRegistrationForm select,#userRegistrationForm input").each(
      function () {
        if ($(this).val() === "" || $(this).val() === null) {
          $(this).addClass("is-invalid");
        } else {
          $(this).removeClass("is-invalid");
        }
      }
    );
    let formData = {
      firstName,
      lastName,
      email,
      password,

      userRole,
      gender,
      languages,

      mobileNo: countryCode + mobileNo,
      address,
      bio,
      image: imageKey,
    };
    if (!isFormDataFilled(formData)) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please fill all necessory fields!");
      });
      return;
    }
    if (!checkbox) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please Agree with privacy & policies");
      });
    }

    // AJAX call to the API endpoint
    $.ajax({
      url: BASE_URL + "/api/v1/auth/register-user",
      type: "POST",
      contentType: "application/json", // Set content type to JSON
      data: JSON.stringify(formData),
      success: function (response) {
        console.log("API Response:", response);
        // Handle successful response
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.message);
        });
        window.location.href = "page-verification.html";
        // window.location.href = "page-login.html";
      },
      error: function (xhr, status, error) {
        let errRes = xhr.responseJSON;

        let verification_data = {
          email: formData.email,
          mobileNo: formData.mobileNo,
        };
        if (errRes?.code === 403) {
          //403--> user already created and verified
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("error", errRes?.message);
          });

          localStorage.setItem(
            "verification_data",
            JSON.stringify(verification_data)
          );
          window.location.href = "page-verification.html";
        } else if (errRes?.code === 402) {
          //user already registered but not verified email and mobile--(user triying to registering again)
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("error", errRes?.message);
          });
          verification_data.mobileNo = undefined;
          verification_data.email = undefined;
          localStorage.setItem(
            "verification_data",
            JSON.stringify(verification_data)
          );
        } else {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast(
              "error",
              errRes.message
                ? errRes.message
                : "Error while registering user. Please try again"
            );
          });
        }
      },
    });
  });
});

function isFormDataFilled(formData) {
  for (let key in formData) {
    if (!formData[key]) {
      return false; // If any value is empty, return false
    }
  }
  return true; // All keys are filled
}
