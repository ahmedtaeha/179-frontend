// save edit changes
$("#modal-edit").on("click", ".save-changes", function () {
  // Get the updated data from the modal input fields
  let updatedImage = $("#file-ip-1")[0].files[0];
  let updatedFirstName = $('input[name="firstName"]').val();
  let updatedLastName = $('#modal-edit input[name="lastName"]').val();
  let updatedEmail = $('#modal-edit input[name="email"]').val();
  let updatedMobileNo = $('#modal-edit input[name="mobileNo"]').val();
  let updatedBirthday = $('#modal-edit input[name="birthday"]').val();

  let updatedMartialStatus =
    $('#modal-edit select[name="martialStatus"]').val() === "married"
      ? true
      : false;

  let updatedGender = $('#modal-edit select[name="sex"]').val();
  let updatedBloodgroup = $('#modal-edit select[name="bloodGroup"]').val();
  let updatedWeight = $('#modal-edit input[name="weight"]').val();
  let updatedHeight = $('#modal-edit input[name="height"]').val();
  let updatedAddress = $('#modal-edit textarea[name="address"]').val();
  let updatedPatientHistory = $(
    '#modal-edit textarea[name="patientHistory"]'
  ).val();
  // let updatedTestName = $("#all-test-modal input[name='testName']").val();
  // let updatedTestDescription = $(
  //   "#all-test-modal input[name='testDescription']"
  // ).val();
  // console.log(updatedTestDescription, updatedTestName);
  // if (updatedTestName && updatedTestDescription) {
  //   // Construct the request payload
  let requestData = {
    // image: updatedImage,
    firstName: updatedFirstName,
    lastName: updatedLastName,
    email: updatedEmail,
    mobileNo: updatedMobileNo,
    birthday: updatedBirthday,
    martialStatus: updatedMartialStatus,
    gender: updatedGender,
    bloodGroup: updatedBloodgroup,
    weight: updatedWeight,
    height: updatedHeight,
    address: updatedAddress,
    patientHistory: updatedPatientHistory,
  };

  let current = this;
  if (updatedImage !== undefined) {
    uploadImageAndGetKey(updatedImage)
      .then(function (response) {
        console.log(response);
        requestData.image = response?.key;
        handleEditSubmit(requestData);
      })
      .catch((error) => {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Error uploading image");
        });
      });
  } else {
    handleEditSubmit(requestData);
  }
  // Function to upload image and get image key
  function uploadImageAndGetKey(imageFile) {
    return new Promise(function (resolve, reject) {
      // Create FormData object to send image file
      let imageData = new FormData();
      imageData.append("file", imageFile);

      // Make AJAX request to upload image
      $.ajax({
        url: BASE_URL + "/api/v1/public/upload",
        type: "POST",
        data: imageData,
        contentType: false,
        processData: false,
        success: function (response) {
          // Image uploaded successfully, resolve with image key
          resolve(response?.data);
        },
        error: function (xhr, status, error) {
          // Error uploading image, reject with error
          reject(error);
        },
      });
    });
  }

  function handleEditSubmit(requestData) {
    // Make the AJAX request to the edit API endpoint
    $.ajax({
      url: BASE_URL + "/api/v1/users/edit-patient/" + rowData.id,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        // console.log("Test edited successfully:", response);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.data?.message);
        });
        // Close the modal
        $("#modal-edit").modal("hide");
        window.location.reload();
      },
      error: function (xhr, status, error) {
        // Handle error
        console.error("Error:", error, xhr);
        let errRes = xhr.responseJSON;
        if (errRes?.code === 403) {
          //403--> patient already created
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("error", errRes?.message);
          });
        } else {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast(
              "error",
              errRes.message
                ? errRes.message
                : "Error while registering patient. Please try again!!"
            );
          });
        }
      },
    });
  }
});
