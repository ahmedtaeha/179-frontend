const BASE_URL = "https://medicalapi.estulife.com";
const { id: userId } = JSON.parse(localStorage.getItem("user_data"));

// ========================================================================= //
//   Table Example 1
// ========================================================================= //

// Start DataTable
const endpointex1 = BASE_URL + "/api/v1/test/get-tests";
let ex1 = jQuery("#example1").DataTable({
  ajax: {
    url: endpointex1,
    type: "GET",
    dataType: "json",
    dataSrc: "data.tests", // Assuming 'data' is the property containing the array of tests data
  },
  columns: [
    { data: "id" },
    { data: "name" },
    { data: "description" },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;
        return (
          '<a class="mr-4 vue"><span class="fa fa-eye tbl-eye" aria-hidden="true"></span></a>' +
          '<a data-bs-toggle="modal" data-bs-target="#all-test-modal" class="mr-4 tbl-edit"><span class="fas fa-pencil-alt tbl-edit"></span></a><a data-id="' +
          entryId +
          '"class="mr-4 delet"><span class="fas fa-trash-alt tbl-delet"></span></a>'
        );
      },
    },
  ],
});

// Function to show modal result for a test
$("#example1 tbody").on("click", "a.vue", function () {
  let rowData = ex1.row($(this).parents("tr")).data(); // Get the data for the clicked row
  if (rowData) {
    let uploads = JSON.parse(rowData.uploads); // Parse the uploads JSON string into an array

    let filesHTML = ""; // Initialize an empty string to store HTML for files

    // Iterate through each upload and generate HTML for it
    if (uploads.length > 0) {
      uploads.forEach(function (upload) {
        console.log(upload);
        // Determine the type of file based on its filetype
        let fileType = "";
        if (upload.filetype.startsWith("image")) {
          fileType = "Image";
        } else if (upload.filetype.startsWith("video")) {
          fileType = "Video";
        } else if (upload.filetype === "application/pdf") {
          fileType = "PDF";
        } else {
          fileType = "Unknown";
        }

        // Generate HTML for the file
        filesHTML += `<div><b>${fileType}</b>: <a href="https://d2ey23d163tyk1.cloudfront.net/${upload.key}" target="_blank">View</a></div>`;
      });
    } else {
      filesHTML += `<div><b>No Files</b></div>`;
    }

    // Generate HTML for the modal content
    let modalContentHTML = `
      <table class="table table-striped table-responsive-sm modalShowTable" width="100%">
        <tbody>
          <tr><td>Test Name:</td><td>${rowData.name}</td></tr>
          <tr><td>Description:</td><td>${rowData.description}</td></tr>
          <tr><td>Files:</td><td>${filesHTML}</td></tr>
        </tbody>
      </table>
    `;

    // Set the modal content and show the modal
    $(".insertHere").html(modalContentHTML);
    $("#testModal").modal("show");
  } else {
    console.error("Row data not found.");
  }
});

// Delete Row Datatable

$("#example1 tbody").on("click", "a.delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/test/delete-test/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      ex1.row($(deleteButton).parents("tr")).remove().draw();
      response?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.message);
            }),
          [2000]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
    },
  });
});

// Function to handle click on edit icon
let rowData;
$("#example1 tbody").on("click", "a.tbl-edit", function () {
  rowData = ex1.row($(this).parents("tr")).data(); // Get the data for the clicked row
  // console.log("hrll", rowData);
  let modal = $("#all-test-modal");
  // console.log(modal);
  if (rowData) {
    // Populate modal input fields with data
    modal.find('input[name="testName"]').val(rowData.name);

    $("#all-test-modal")
      .find('input[name="testDescription"]')
      .val(rowData.description);
    // $("#all-test-modal").modal("show");
  } else {
    console.error("Row data not found.");
  }
});

// save edit changes
$("#all-test-modal").on("click", ".save-changes", function () {
  // Get the updated data from the modal input fields
  let updatedTestName = $("#all-test-modal input[name='testName']").val();
  let updatedTestDescription = $(
    "#all-test-modal input[name='testDescription']"
  ).val();
  // console.log(updatedTestDescription, updatedTestName);

  if (updatedTestName && updatedTestDescription) {
    // Construct the request payload
    let requestData = {
      name: updatedTestName,
      description: updatedTestDescription,
    };

    let current = this;
    // Make the AJAX request to the edit API endpoint
    $.ajax({
      url: BASE_URL + "/api/v1/test/edit-test/" + rowData.id,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        // console.log("Test edited successfully:", response);
        window.location.reload();
        // Close the modal
        //   $("#all-test-modal").modal("hide");
      },
      error: function (xhr, status, error) {
        console.error("Error editing test:", error);
      },
    });
  } else {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("info", "Fields can not be empty");
    });
  }
});

// handle add test

// $("#addTestForm").on("submit", function (event) {
//   event.preventDefault(); // Prevent the default form submission

//   let name = $("input[name='name']").val();
//   let description = $("input[name='description']").val();

//   let file = $("#file-upload")[0].files[0];
//   // const file = $(this)[0].files[0];
//   console.log(file);
//   // Function to upload image and get image key

//   // Get form data
//   let formData = {
//     name,
//     description,
//   };

//   // Check if any field is empty
//   $("select, input,textarea").each(function () {
//     if ($(this).val() === "" || $(this).val() === null) {
//       $(this).addClass("is-invalid");
//     } else {
//       $(this).removeClass("is-invalid");
//     }
//   });
//   if (!isFormDataFilled(formData)) {
//     return;
//   }
//   if (file) {
//     uploadImageAndGetKey(file)
//       .then(function (response) {
//         // console.log(response);
//         let resData = [{ filetype: response?.filetype, key: response?.key }];
//         formData.uploads = resData;
//         handleSubmitTest(formData);
//       })
//       .catch((error) => {
//         $.getScript("./assets/js/toaster-custom.js", function () {
//           showToast("error", "Error uploading image");
//         });
//       });
//     function uploadImageAndGetKey(imageFile) {
//       return new Promise(function (resolve, reject) {
//         // Create FormData object to send image file
//         let imageData = new FormData();
//         imageData.append("file", imageFile);

//         // Make AJAX request to upload image
//         $.ajax({
//           url: BASE_URL + "/api/v1/public/upload",
//           type: "POST",
//           data: imageData,
//           contentType: false,
//           processData: false,
//           success: function (response) {
//             // Image uploaded successfully, resolve with image key
//             resolve(response?.data);
//           },
//           error: function (xhr, status, error) {
//             // Error uploading image, reject with error
//             reject(error);
//           },
//         });
//       });
//     }
//   }
//   // return;

//   function handleSubmitTest(requestData) {
//     // Make AJAX request to your API
//     $.ajax({
//       url: BASE_URL + "/api/v1/test/add-test",
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(requestData),
//       success: function (response) {
//         // Handle successful response
//         // console.log("API call successful:", response);
//         setTimeout(() => {
//           $.getScript("./assets/js/toaster-custom.js", function () {
//             showToast("success", response?.data?.message);
//           });
//           // window.location.href = "all-tests.html";
//         }, [500]);
//       },
//       error: function (xhr, status, error) {
//         // Handle error
//         console.error("Error:", error);
//       },
//     });
//   }
// });

// ========================================================================= //
//   Table Example 2 Patients
// ========================================================================= //

// Hide colmun Datatable

// Define the endpoint
const endpoint = BASE_URL + "/api/v1/users/get-patients/" + userId;

// Initialize DataTable
let dataTable = $("#example2").DataTable({
  ajax: {
    url: endpoint,
    type: "GET",
    dataType: "json",
    dataSrc: "data", // Assuming 'data' is the property containing the array of patient data
  },
  columns: [
    {
      data: null,
      render: function (data, type, row, meta) {
        return (
          '<img class="rounded-circle" style="cursor:pointer;" width="35" src="' +
          `${
            !data.image || data.image === "profile.jpg"
              ? "../assets/images/client.jpg"
              : "https://d2ey23d163tyk1.cloudfront.net/" + data?.image
          }` +
          '" alt="img">'
        );
      },
    },
    { data: "firstName" },
    { data: "lastName" },
    { data: "email" },
    { data: "mobileNo" },
    { data: "birthday" },
    {
      data: "martialStatus",
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${row.martialStatus ? row?.martialStatus : "---"}` +
          "</td></tr>"
        );
      },
    },
    { data: "gender" },
    { data: "bloodGroup" },
    { data: "weight" },
    { data: "height" },
    { data: "address" },
    { data: "patientHistory" },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;
        return (
          '<a class="mr-4 vue"><span class="fa fa-eye tbl-eye" aria-hidden="true"></span></a>' +
          '<a data-bs-toggle="modal" data-bs-target="#modal-edit" class="mr-4 tbl-edit"><span class="fas fa-pencil-alt tbl-edit"></span></a>' +
          '<a class="mr-4 delet" data-id="' +
          entryId +
          '"><span class="fas fa-trash-alt tbl-delet"></span></a>'
        );
      },
    },
  ],
  columnDefs: [
    {
      targets: [3, 5, 8, 9, 10, 11, 12], // Hide these columns
      visible: false,
    },
  ],
});

// Function to show modal result for a patient
$("#example2 tbody").on("click", ".vue", function () {
  let rowData = dataTable.row($(this).parents("tr")).data(); // Get the data for the clicked row
  if (rowData) {
    $(".insertHere").html(
      '<table class="table table-striped table-responsive-sm modalShowTable" width="100%"><tbody>' +
        "<tr><td>First Name</td><td>" +
        rowData.firstName +
        "</td></tr>" +
        "<tr><td>Last name</td><td>" +
        rowData.lastName +
        "</td></tr>" +
        "<tr><td>Email</td><td>" +
        rowData.email +
        "</td></tr>" +
        "<tr><td>Mobile No.</td><td>" +
        rowData.mobileNo +
        "</td></tr>" +
        "<tr><td>Birthday</td><td>" +
        rowData.birthday +
        "</td></tr>" +
        "<tr><td>Marital status</td><td>" +
        (rowData.martialStatus ? rowData.martialStatus : "----") +
        "</td></tr>" +
        "<tr><td>Sex</td><td>" +
        rowData.gender +
        "</td></tr>" +
        "<tr><td>Blood Group</td><td>" +
        rowData.bloodGroup +
        "</td></tr>" +
        "<tr><td>Patient Weight</td><td>" +
        rowData.weight +
        "</td></tr>" +
        "<tr><td>Patient Height</td><td>" +
        rowData.height +
        "</td></tr>" +
        "<tr><td>Address</td><td>" +
        rowData.address +
        "</td></tr>" +
        "<tr><td>Patient History</td><td>" +
        rowData.patientHistory +
        "</td></tr>" +
        "<tr><td>Previous Illness</td><td>" +
        rowData.previousIllnesses +
        "</td></tr>" +
        "<tr><td>Current Illness</td><td>" +
        rowData.currentIllnesses +
        "</td></tr>" +
        "<tr><td>Health Conditions</td><td>" +
        rowData.healthConditions +
        "</td></tr>" +
        "<tr><td>Specific Allergies</td><td>" +
        rowData.SpecificAllergies +
        "</td></tr>" +
        "</tbody></table>"
    );
    $("#myModal").modal("show");
  } else {
    console.error("Row data not found.");
  }
});

// Delete Row Datatable
$("#example2 tbody").on("click", ".delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  // console.log(entryId);
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/users/delete-patient/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      // ex1.row($(deleteButton).parents("tr")).remove().draw();
      dataTable.row($(deleteButton).parents("tr")).remove().draw();
      response?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.message);
            }),
          [2000]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
    },
  });
});

// handle add Patient

$("#addPatientForm").on("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  // console.log("bharat");
  // Get form data
  let formData = {
    userId: userId,
    image: $("#file-ip-1")[0].files[0],
    firstName: $("input[name='firstName']").val(),
    lastName: $("input[name='lastName']").val(),
    email: $("input[name='email']").val(),
    mobileNo: $("input[name='mobileNo']").val(),
    birthday: $("input[name='birthday']").val(),
    martialStatus:
      $("select[name='martialStatus']").val() === "true" ? true : false,
    gender: $("select[name='sex']").val(),
    bloodGroup: $("select[name='bloodGroup']").val(),
    weight: $("input[name='weight']").val(),
    height: $("input[name='height']").val(),
    address: $("textarea[name='address']").val(),
    patientHistory: $("textarea[name='patientHistory']").val(),
    // knownDiseases: $("select[name='knowndiseases']").val(),
    period: $("input[name='period']").val(),
    familyHistory: $("select[name='familyHistory']").val(),
    diseases: $("input[name='diseases']").val(),
    previousIllnesses: $("input[name='prevIllness']").val(),
    currentIllnesses: $("input[name='currentIllness']").val(),
    healthConditions: $("input[name='healthConditions']").val(),
    SpecificAllergies: $("input[name='specificAllergies']").val(),
  };
  // console.log(formData);
  if (!formData.image) {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("error", "Please select an image");
    });
    // console.log("inside if");
    return;
  }
  // Check if any field is empty
  $("select, input,textarea").each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  // console.log("before check validation");
  if (!isFormDataFilled(formData)) {
    // console.log("inside check validation");
  }
  // console.log("after check validation");
  if (
    $("input[name='mobileNo']").val().length < 10 ||
    $("input[name='mobileNo']").val().length > 10
  ) {
    $(this).addClass("is-invalid");
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("info", "mobile length should be 10 characters");
    });
    return;
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
  uploadImageAndGetKey(formData.image)
    .then(function (response) {
      // console.log(response);
      formData.image = response?.key;
      handleSubmit(formData);
    })
    .catch((error) => {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Error uploading image");
      });
    });
  function handleSubmit(requestData) {
    // console.log(requestData, "bbb");
    // Make AJAX request to your API
    $.ajax({
      url: BASE_URL + "/api/v1/auth/add-patient",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        // Handle successful response
        // console.log("API call successful:", response);
        setTimeout(() => {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", response?.message);
          });
          window.location.href = "all-patients.html";
        }, [500]);
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

// Function to handle click on edit icon
let SelectedPatientData;
$("#example2 tbody").on("click", ".tbl-edit", function () {
  rowData = dataTable.row($(this).parents("tr")).data(); // Get the data for the clicked row
  let modal = $("#modal-edit");

  if (rowData) {
    // Populate modal input fields with data
    // Show image if available in rowData.data
    if (rowData.image) {
      $("#file-ip-1-preview").attr(
        "src",
        "https://d2ey23d163tyk1.cloudfront.net/" + rowData.image
      );
    } else {
      $("#file-ip-1-preview").attr("src", ""); // Clear image source if no image available
    }

    // Show or hide file input based on whether image is present
    if (rowData.image) {
      $("#file-ip-1").hide(); // Hide file input
    } else {
      $("#file-ip-1").show(); // Show file input
    }

    // Handle edit functionality for image
    $("#file-ip-1").change(function (event) {
      showPreview(event);
    });

    $("#modal-title-edit-row").text(rowData.firstName + " " + rowData.lastName);
    modal.find('input[name="firstName"]').val(rowData.firstName);
    modal.find('input[name="lastName"]').val(rowData.lastName);
    modal.find('input[name="email"]').val(rowData.email);
    modal.find('input[name="mobileNo"]').val(rowData.mobileNo);
    modal.find('input[name="birthday"]').val(rowData.birthday);

    modal.find('select[name="martialStatus"]').val(rowData.martialStatus);
    modal.find('select[name="sex"]').val(rowData.gender);
    modal.find('select[name="bloodGroup"]').val(rowData.bloodGroup);
    modal.find('input[name="weight"]').val(rowData.weight);
    modal.find('input[name="height"]').val(rowData.height);
    modal.find('textarea[name="address"]').val(rowData.address);
    modal.find('textarea[name="patientHistory"]').val(rowData.patientHistory);
    modal
      .find('textarea[name="currentIllnesses"]')
      .val(rowData.currentIllnesses);
    modal
      .find('textarea[name="previousIllnesses"]')
      .val(rowData.previousIllnesses);
    modal
      .find('textarea[name="healthConditions"]')
      .val(rowData.healthConditions);
    modal
      .find('textarea[name="specificAllergies"]')
      .val(rowData.SpecificAllergies);
    //   $("#all-test-modal")
    //     .find('input[name="testDescription"]')
    //     .val(rowData.description);
    //   // $("#all-test-modal").modal("show");
  } else {
    console.error("Row data not found.");
  }
});

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
  let updatedPreviousIllnesses = $(
    "#modal-edit textarea[name='previousIllnesses']"
  ).val();
  let updatedCurrentIllnesses = $(
    "#modal-edit textarea[name='currentIllnesses']"
  ).val();
  let updatedHealthConditions = $(
    "#modal-edit textarea[name='healthConditions']"
  ).val();
  let updatedSpecificAllergies = $(
    "#modal-edit textarea[name='specificAllergies']"
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
    previousIllnesses: updatedPreviousIllnesses,
    currentIllnesses: updatedCurrentIllnesses,
    healthConditions: updatedHealthConditions,
    SpecificAllergies: updatedSpecificAllergies,
  };

  let current = this;
  if (updatedImage !== undefined) {
    uploadImageAndGetKey(updatedImage)
      .then(function (response) {
        // console.log(response);
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

// ========================================================================= //
//   Table Example 3
// ========================================================================= //

// Billing List Table

// var ex3 = jQuery("#example3").DataTable({
//   dom: "lrtip",
//   ordering: false,
//   bPaginate: true,
//   bInfo: true,
//   bSort: false,
//   lengthChange: false,
// });

// Delete Row Datatable

// $("#example3 tbody").on("click", ".delet", function () {
//   ex3.row($(this).parents("tr")).remove().draw();
// });

// // Filter by Date inside datatable

// minDateFilter = "";
// maxDateFilter = "";

// $("#daterange").daterangepicker();
// $("#daterange").on("apply.daterangepicker", function (ev, picker) {
//   minDateFilter = Date.parse(picker.startDate);
//   maxDateFilter = Date.parse(picker.endDate);

//   $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
//     var date = Date.parse(data[1]);

//     if (
//       (isNaN(minDateFilter) && isNaN(maxDateFilter)) ||
//       (isNaN(minDateFilter) && date <= maxDateFilter) ||
//       (minDateFilter <= date && isNaN(maxDateFilter)) ||
//       (minDateFilter <= date && date <= maxDateFilter)
//     ) {
//       return true;
//     }
//     return false;
//   });
//   invoiceTable.draw();
// });

// // Select filter inside datatable

// $(".table-filter-select").on("change", function () {
//   invoiceTable.search(this.value).draw();
// });

// // Form search inside table

// $("#myInputTextField").keyup(function () {
//   invoiceTable.search($(this).val()).draw();
// });

// ================================================================= //
// DRUG TABLE 4
// ================================================================= //

//get list
let drugTable = jQuery("#drug-table").DataTable({
  ajax: {
    url: BASE_URL + "/api/v1/drugs/get-drugs",
    type: "GET",
    dataType: "json",
    dataSrc: "data.drugs", // Assuming 'data' is the property containing the array of patient data
  },
  columns: [
    {
      data: "id",
      render: function (data, type, row, meta) {
        return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
      },
    },
    {
      data: "name",
      render: function (data, type, row, meta) {
        return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
      },
    },
    {
      data: "genericName",
      render: function (data, type, row, meta) {
        return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
      },
    },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;
        return (
          '<td class="text-start"><a data-bs-toggle="modal" data-bs-target="#drug-modal-edit" class="mr-4 tbl-edit"><span class="fas fa-pencil-alt tbl-edit"></span></a><a data-id="' +
          entryId +
          '"class="mr-4 delet"><span class="fas fa-trash-alt tbl-delet"></span></a></td>'
        );
      },
    },
  ],
});

// Delete Row Datatable
$("#drug-table tbody").on("click", ".delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  // console.log(entryId);
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/drugs/delete-drug/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      // ex1.row($(deleteButton).parents("tr")).remove().draw();
      drugTable.row($(deleteButton).parents("tr")).remove().draw();
      response?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.message);
            }),
          [2000]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
    },
  });
});

// handle add Patient

$("#addDrugForm").on("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  // console.log("bharat");
  // Get form data
  let formData = {
    name: $("input[name='name']").val(),
    genericName: $("input[name='genericName']").val(),
    note: $("textarea[name='note']").val(),
  };

  // Check if any field is empty
  $(" input,textarea").each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });
  if (!isFormDataFilled(formData)) {
    return;
  }

  // console.log(formData);
  // Make AJAX request to your API
  $.ajax({
    url: BASE_URL + "/api/v1/drugs/add-drug",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      // Handle successful response
      // console.log("API call successful:", response);
      setTimeout(() => {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.data?.message);
        });
        window.location.href = "add-drug.html";
      }, [500]);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error:", error, xhr);
      let errRes = xhr.responseJSON;
      if (errRes?.code === 403) {
        //403--> drug already created
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes?.message);
        });
      } else {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast(
            "error",
            errRes.message
              ? errRes.message
              : "Error while Adding Drug. Please try again!!"
          );
        });
      }
    },
  });
});

// Function to handle click on edit icon
$("#drug-table tbody").on("click", ".tbl-edit", function () {
  rowData = drugTable.row($(this).parents("tr")).data(); // Get the data for the clicked row
  // console.log("hrll", rowData);
  let modal = $("#drug-modal-edit");
  // console.log(modal);

  if (rowData) {
    // Populate modal input fields with data
    modal.find('input[name="name"]').val(rowData.name);
    modal.find('input[name="genericName"]').val(rowData.genericName);
    modal.find('textarea[name="note"]').val(rowData.note);
  } else {
    console.error("Row data not found.");
  }
});

// save edit changes
$("#editDrugForm").on("submit", function (event) {
  endpoint.preventDefault();
  // console.log("edit form");
});
$("#drug-modal-edit").on("click", ".save-edit", function () {
  // Get the updated data from the modal input fields
  let updatedName = $('#drug-modal-edit input[name="name"]').val();
  let updatedGenericName = $(
    '#drug-modal-edit input[name="genericName"]'
  ).val();
  let updatedNote = $('#drug-modal-edit textarea[name="note"]').val();
  if (updatedName && updatedGenericName && updatedNote) {
    //   // Construct the request payload
    let requestData = {
      name: updatedName,
      genericName: updatedGenericName,
      note: updatedNote,
    };

    let current = this;
    // Make the AJAX request to the edit API endpoint
    $.ajax({
      url: BASE_URL + "/api/v1/drugs/drug/" + rowData.id,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        // console.log("Drug edited successfully:", response);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.message);
        });
        // Close the modal
        $("#drug-modal-edit").modal("hide");
        window.location.reload();
      },
      error: function (xhr, status, error) {
        // Handle error
        console.error("Error:", error, xhr);
        let errRes = xhr.responseJSON;
        if (errRes?.code === 403) {
          //403--> drug already created
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
  } else {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("info", "Fields can not be empty");
    });
  }
});

// ================================================================= //
// PRESCRIPTION TABLE
// ================================================================= /

//get list
let PrescriptionTable = jQuery("#prescription-table").DataTable({
  ajax: {
    url: BASE_URL + "/api/v1/prescription/get-prescription/" + userId,
    type: "GET",
    dataType: "json",
    dataSrc: "data.prescriptions", // Assuming 'data' is the property containing the array of patient data
  },
  columns: [
    {
      data: "id",
      render: function (data, type, row, meta) {
        return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
      },
    },
    // {
    //   data: "patientId",
    //   render: function (data, type, row, meta) {
    //     return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
    //   },
    // },
    {
      data: null,
      render: function (data, type, row, meta) {
        // console.log(row);
        return (
          '<tr class="text-center"><td>' +
          `${row?.patient?.firstName}&nbsp;${row?.patient?.lastName}` +
          "</td></tr>"
        );
      },
    },
    {
      data: "prescriptionUpdatedAt",
      render: function (data, type, row, meta) {
        // Parsing the date string into a Date object
        let apiDate = new Date(data);

        let day = apiDate.getDate().toString().padStart(2, "0"); // Ensure two-digit day
        let month = (apiDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
        let year = apiDate.getFullYear();
        let formattedDate = `${day}-${month}-${year}`;

        // console.log(formattedDate); // Output: 20-04-2024
        return "<tr><td>" + `${data ? formattedDate : "---"}` + "</td></tr>";
      },
    },
    {
      data: null,
      render: function (data, type, row, meta) {
        // (3 Drugs | 1 Tests )format
        return (
          "<tr><td>" +
          `${row?.drugs?.length}&nbsp;Drugs&nbsp;&vert;&nbsp;${row?.tests?.length}&nbsp;Tests` +
          "</td></tr>"
        );
      },
    },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;

        return (
          `<a href='#' class='mr-4'>
          <span class='fa fa-eye tbl-eye vue' aria-hidden='true'></span>
      </a>` +
          // `<a class='mr-4'>
          //     <span class='fas fa-print tbl-print'></span>
          // </a>`+
          `<a  data-id ="` +
          entryId +
          `" class='mr-4 delet'>
          <span class='fas fa-trash-alt tbl-delet tbl-delet'></span>
      </a>`
        );
      },
    },
  ],
});

// Function to show modal result for a patient
$("#prescription-table tbody").on("click", ".vue", function () {
  let rowData = PrescriptionTable.row($(this).parents("tr")).data(); // Get the data for the clicked row
  // console.log("bb", rowData);
  if (rowData) {
    let drugsHtml = "";
    if (rowData.drugs && rowData.drugs.length > 0) {
      rowData.drugs.forEach((drug, index) => {
        drugsHtml += `
          <tr><td>Drug ${index + 1} - Mg</td><td>${drug.mg}</td></tr>
          <tr><td>Drug ${index + 1} - Dose</td><td>${drug.dose}</td></tr>
          <tr><td>Drug ${index + 1} - Type</td><td>${drug.type}</td></tr>
          <tr><td>Drug ${index + 1} - Advice</td><td>${drug.advice}</td></tr>
          <tr><td>Drug ${index + 1} - Duration</td><td>${
          drug.duration
        }</td></tr>
        `;
      });
    } else {
      drugsHtml += "<tr><td colspan='2'>No drugs prescribed.</td></tr>";
    }

    let testsHtml = "";
    if (rowData.tests && rowData.tests.length > 0) {
      rowData.tests.forEach((test, index) => {
        testsHtml += `
          <tr><td>Test ${index + 1} - Name</td><td>${
          test.name || "N/A"
        }</td></tr>
          <tr><td>Test ${index + 1} - Description</td><td>${
          test.description || "N/A"
        }</td></tr>
        `;
      });
    } else {
      testsHtml += "<tr><td colspan='2'>No tests prescribed.</td></tr>";
    }

    $(".insertHere").html(
      '<table class="table table-striped table-responsive-sm modalShowTable" width="100%"><tbody>' +
        "<tr><td>Prescription ID</td><td>" +
        rowData?.id +
        "</td></tr>" +
        "<tr><td>Patient ID</td><td>" +
        rowData?.patientId +
        "</td></tr>" +
        "<tr><td>First Name</td><td>" +
        rowData?.patient?.firstName +
        "</td></tr>" +
        "<tr><td>Last name</td><td>" +
        rowData?.patient?.lastName +
        "</td></tr>" +
        "<tr><td>Email</td><td>" +
        rowData?.patient.email +
        "</td></tr>" +
        "<tr><td>Mobile No.</td><td>" +
        rowData?.patient?.mobileNo +
        "</td></tr>" +
        "<tr><td>Birthday</td><td>" +
        rowData?.patient?.birthday +
        "</td></tr>" +
        "<tr><td>Marital status</td><td>" +
        (rowData?.patient?.martialStatus
          ? rowData?.patient?.martialStatus
          : "----") +
        "</td></tr>" +
        "<tr><td>Sex</td><td>" +
        rowData?.patient?.gender +
        "</td></tr>" +
        "<tr><td>Blood Group</td><td>" +
        rowData?.patient?.bloodGroup +
        "</td></tr>" +
        "<tr><td>Patient Weight</td><td>" +
        rowData?.patient?.weight +
        "</td></tr>" +
        "<tr><td>Patient Height</td><td>" +
        rowData?.patient?.height +
        "</td></tr>" +
        "<tr><td>Address</td><td>" +
        rowData?.patient?.address +
        "</td></tr>" +
        "<tr><td>Patient familyHistory</td><td>" +
        rowData?.patient?.familyHistory +
        "</td></tr>" +
        "<tr><td>Total Drugs</td><td>" +
        rowData?.drugs?.length +
        "</td></tr>" +
        drugsHtml +
        "<tr><td>TotalTests</td><td>" +
        rowData?.tests?.length +
        "</td></tr>" +
        testsHtml +
        "</tbody></table>"
    );
    $("#prescription-view").modal("show");
  } else {
    console.error("Row data not found.");
  }
});

// Delete Row Datatable
$("#prescription-table tbody").on("click", ".delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  // console.log(entryId);
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/prescription/delete-prescription/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      // ex1.row($(deleteButton).parents("tr")).remove().draw();
      PrescriptionTable.row($(deleteButton).parents("tr")).remove().draw();
      response?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.message);
            }),

          [2000]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
    },
  });
});

// ================================================================= //
// INVOICE and BILLING TABLE
// ================================================================= //

//get list
let invoiceTable = jQuery("#invoice-table").DataTable({
  ajax: {
    url: BASE_URL + "/api/v1/invoice/get-invoices/" + userId,
    type: "GET",
    dataType: "json",
    dataSrc: "data.invoices", // Assuming 'data' is the property containing the array of invoice data
  },
  columns: [
    {
      data: "id",
      render: function (data, type, row, meta) {
        return "<tr><td>" + `${data ? data : "---"}` + "</td></tr>";
      },
    },
    {
      data: "patientId",
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${
            data
              ? row?.patient?.firstName + " " + row?.patient?.lastName
              : "---"
          }` +
          "</td></tr>"
        );
      },
    },

    {
      data: "updatedAt",
      render: function (data, type, row, meta) {
        // Parsing the date string into a Date object
        let apiDate = new Date(data);

        let day = apiDate.getDate().toString().padStart(2, "0"); // Ensure two-digit day
        let month = (apiDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
        let year = apiDate.getFullYear();
        let formattedDate = `${year}-${month}-${day}`;

        // console.log(formattedDate); // Output: 20-04-2024
        return "<tr><td>" + `${data ? formattedDate : "---"}` + "</td></tr>";
      },
    },
    {
      data: "amount",
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${row?.amount}&nbsp;&nbsp;${row?.currency}` +
          "</td></tr>"
        );
      },
    },
    {
      data: "paymentStatus",
      render: function (data, type, row, meta) {
        let paid = false;
        if (data === "paid") {
          paid = true;
        }
        return `<td >
                      <span data-id="${
                        row.id
                      }" data-status="${data}" class=" payment-status text badge ${
          data === "paid" ? "badge-primary" : "badge-danger"
        }">${data}</span>
                  </td>`;
      },
    },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;
        return (
          // `<a href='#' class='mr-4'>
          //     <span class='fa fa-eye tbl-eye' aria-hidden='true'></span>
          // </a>` +
          // `<a class='mr-4'>
          //     <span class='fas fa-print tbl-print'></span>
          // </a>`+
          `<a  data-id ="` +
          entryId +
          `" class='mr-4 delet'>
          <span class='fas fa-trash-alt tbl-delet tbl-delet'></span>
      </a>`
        );
      },
    },
  ],
});

// Handle click event on payment status
$("#invoice-table").on("click", ".payment-status", function () {
  const invoiceId = $(this).data("id");
  let currentStatus = $(this).data("status");
  // console.log("clicked", invoiceId, currentStatus);

  // Toggle payment status
  let newStatus = currentStatus === "paid" ? "unpaid" : "paid";

  // Make AJAX request to update payment status
  if (newStatus === "paid") {
    $.ajax({
      url: BASE_URL + "/api/v1/invoice/update-payment-status/" + invoiceId,
      type: "PUT",
      contentType: "application/json", // Specify JSON content type
      data: JSON.stringify({ status: newStatus }),
      success: function (response) {
        // Updating the DataTable to reflect the changes
        invoiceTable.ajax.reload();
        setTimeout(() => {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", response?.message);
          });
        }, [2000]);
      },
      error: function (xhr, status, error) {
        console.error("Error changing payment status:", error);
        // Handle error if needed
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "something went wrong");
        });
      },
    });
  } else {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("error", "you can not change payment status to unpaid");
    });
  }
});

// Delete Row Datatable
$("#invoice-table tbody").on("click", ".delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  // console.log(entryId);
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/invoice/delete-invoice/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      // ex1.row($(deleteButton).parents("tr")).remove().draw();
      invoiceTable.row($(deleteButton).parents("tr")).remove().draw();
      response?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.message);
            }),

          [2000]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
    },
  });
});

// handle add invoice
$("#createInvoiceForm").on("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  // console.log("bharat", event);
  let patientId = $("select[name='patient']").val();
  let paymentMode = $("select[name='paymentMode']").val();
  let paymentStatus = $("select[name='paymentStatus']").val();
  let invoiceTitle = $("input[name='invoiceTitle']").val();
  let amount = $("input[name='amount']").val();
  let currency = "$"; // Assuming currency is always $

  // Check if any field is empty
  $("select, input").each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  let invoiceData = {
    patientId: patientId,
    paymentMode: paymentMode,
    paymentStatus: paymentStatus,
    invoiceTitle: invoiceTitle,
    amount: amount,
    currency: currency,
  };
  // console.log(invoiceData);
  // If form is not valid, stop further execution
  // console.log(isFormValid + "yahahhaa");

  if (!isFormDataFilled(invoiceData)) {
    return;
  }

  // Make AJAX POST request to create invoice
  $.ajax({
    url: BASE_URL + "/api/v1/invoice/add-invoice/" + userId,
    type: "POST",
    contentType: "application/json", // Specify JSON content type
    data: JSON.stringify(invoiceData), // Convert JSON object to string
    success: function (response) {
      // Handle success response
      // console.log("Invoice created successfully:", response);
      setTimeout(() => {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast(
            "success",
            response?.data?.message
              ? response?.data?.message
              : "Invoice created successfully"
          );
        });
        window.location.href = "/billing-list.html";
      }, [2000]);
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error creating invoice:", error);
      // Optionally, display an error message to the user
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Oops! Something went wrong. Please try again");
      });
    },
  });
});

// Filter by Date inside datatable

let minDateFilter = "";
let maxDateFilter = "";

$("#daterange.billing").daterangepicker();
// Event handler for applying date range filter
$("#daterange.billing").on("apply.daterangepicker", function (ev, picker) {
  minDateFilter = picker.startDate;
  maxDateFilter = picker.endDate;

  // Redraw the DataTable to apply the filtering
  invoiceTable.draw();
});
// Event handler for select change
$("#status-filter").on("change", function () {
  let status = $(this).val();
  invoiceTable
    .column(4) // Assuming payment status column is the 5th column (index 4)
    .search(status)
    .draw();
});

// Custom filtering function
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
  // Get the date from the column
  let date = new Date(data[2]); // Assuming the date is in the third column (index 2)

  // Perform date range filtering
  if (
    (!minDateFilter || date >= minDateFilter) &&
    (!maxDateFilter || date <= maxDateFilter)
  ) {
    return true; // Include row in the filtered result
  }
  return false; // Exclude row from the filtered result
});

// Select filter inside datatable

$(".table-filter-select").on("change", function () {
  invoiceTable.search(this.value).draw();
});

// Form search inside table

$("#myInputTextField").keyup(function () {
  invoiceTable.search($(this).val()).draw();
});

// ============================================================
// APPOINTMENT TABLE
// ============================================================

//get list
let appointmentTable = jQuery("#appointment-table").DataTable({
  ajax: {
    url: BASE_URL + "/api/v1/appointment/get-appointments/" + userId,
    type: "GET",
    dataType: "json",
    dataSrc: "data.appointments", // Assuming 'data' is the property containing the array of appointments data
  },
  columns: [
    {
      data: "start_time", //"timeSlot",
      render: function (data, type, row, meta) {
        // console.log(row);
        return (
          "<tr><td>" +
          `${data ? data + " " + row?.end_time : "---"}` +
          "</td></tr>"
        );
      },
    },
    {
      data: "date",
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${data ? formatYYYYMMDDDate(data) : "---"}` +
          "</td></tr>"
        );
      },
    },
    {
      data: null,
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${
            row?.patient?.firstName
              ? row?.patient.firstName + " " + row?.patient?.lastName
              : "---"
          }` +
          "</td></tr>"
        );
      },
    },
    {
      data: null, //address
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${row?.patient ? row?.patient?.address : "---"}` +
          "</td></tr>"
        );
      },
    },
    {
      data: null, //"mobileNo"
      render: function (data, type, row, meta) {
        return (
          "<tr><td>" +
          `${row?.patient ? row?.patient?.mobileNo : "---"}` +
          "</td></tr>"
        );
      },
    },
    // {
    //   data: "appointmentStatus",
    //   render: function (data, type, row, meta) {
    //     let paid = false;
    //     if (data === "paid") {
    //       paid = true;
    //     }
    //     return `<td class="text-start">
    //                   <span data-id="${
    //                     row.id
    //                   }" data-status="${data}" class=" appointment-status text badge ${
    //       data !== "cancelled" ? "badge-primary" : "btn-danger"
    //     }">${data !== "cancelled" ? "Start app" : data}</span>
    //               </td>`;
    //   },
    // },
    {
      data: null,
      render: function (data, type, row, meta) {
        let entryId = row.id;
        return (
          `<td class="text-start">` +
          //     `<a class='mr-4 vue' data-bs-toggle="modal"
          //     data-bs-target="#exampleModalCenter">
          //     <span class='fas fa-user tbl-user'
          //         aria-hidden='true'></span>
          // </a>` +
          '<a data-bs-toggle="modal" data-bs-target="#changeTimeAndDate" class="mr-4 edit  tbl-edit" data-bs-target="#changeTimeAndDate"><span class="fas fa-pencil-alt tbl-edit"></span></a><a data-id="' +
          entryId +
          '"class="mr-4 delet"><span class="fas fa-trash-alt tbl-delet"></span></a></td>'
        );
      },
    },
  ],
});

// Delete Row Datatable
$("#appointment-table tbody").on("click", ".delet", function () {
  let entryId = $(this).data("id");
  // Make AJAX request to delete the entry
  // console.log(entryId);
  let deleteButton = this;
  $.ajax({
    url: BASE_URL + "/api/v1/appointment/delete-appointment/" + entryId,
    type: "DELETE",
    success: function (response) {
      // console.log("Entry deleted successfully:", response);
      appointmentTable.row($(deleteButton).parents("tr")).remove().draw();
      response?.data?.message &&
        setTimeout(
          () =>
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.data?.message);
            }),

          [1500]
        );
    },
    error: function (xhr, status, error) {
      // Handle error if deletion fails
      console.error("Error deleting entry:", error);
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Something went wrong");
      });
    },
  });
});

// Handle click event on appointment status
$("#appointment-table").on("click", ".appointment-status", function () {
  const appointmentId = $(this).data("id");
  let currentStatus = $(this).data("status");
  // console.log("clicked", invoiceId, currentStatus);

  // Toggle payment status
  let newStatus = currentStatus === "pending" ? "cancelled" : "paid";

  // Make AJAX request to update payment status
  if (newStatus === "cancelled") {
    $.ajax({
      url: BASE_URL + "/api/v1/appointment/update-status/" + appointmentId,
      type: "PATCH",
      contentType: "application/json", // Specify JSON content type
      data: JSON.stringify({ status: newStatus }),
      success: function (response) {
        // Updating the DataTable to reflect the changes
        appointmentTable.ajax.reload();
        setTimeout(() => {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", response?.message);
          });
        }, [1000]);
      },
      error: function (xhr, status, error) {
        console.error("Error changing appointment status:", error);
        // Handle error if needed
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "something went wrong");
        });
      },
    });
  } else {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast(
        "error",
        "you can not reschedule appointment after cancelled. create new"
      );
    });
  }
});

// handle add appointment

$("#addAppointmentForm").on("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Check if any field is empty
  $("select, input,textarea").each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });
  // Get form data
  let date = $('input[name="date"]').val();
  let timeRange = $('select[name="timeRange"]').val();
  let patientId = $("select[name='patient']").val();
  let motifPatient = $('textarea[name="motifPatients"]').val();

  let [start_time, end_time] = timeRange.split(" - ");

  let formData = {
    date,
    start_time,
    end_time,
    patientId,
    motifPatient,
    timezone: "Asia/Kolkata",
  };
  // console.log(formData, "nnnnn");
  if (!isFormDataFilled(formData)) {
    return;
  }

  // Make AJAX request to your API
  $.ajax({
    url: BASE_URL + "/api/v1/appointment/add-appointment/" + userId,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      // Handle successful response
      // console.log("API call successful:", response);
      setTimeout(() => {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.data?.message);
        });
        window.location.reload();
      }, [500]);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error:", error);
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Error while making appointment");
      });
    },
  });
});

// Function to handle click on edit icon
$("#appointment-table tbody").on("click", ".tbl-edit", function () {
  rowData = appointmentTable.row($(this).parents("tr")).data(); // Get the data for the clicked row
  // console.log("hrll", rowData);
  let modal = $("#changeTimeAndDate");
  // console.log(modal);

  if (rowData) {
    // Populate modal input fields with data
    let dateValue = formatYYYYMMDDDate(rowData.date);
    modal.find('input[name="dateEdit"]').val(dateValue);

    const optionValue = rowData.start_time + " - " + rowData.end_time;
    const optionText = optionValue;
    const newOption = $("<option></option>").val(optionValue).text(optionText);
    const SelectedtimeRangeDropdown = modal.find(
      'select[name="timeRangeEdit"]'
    );
    SelectedtimeRangeDropdown.empty();
    SelectedtimeRangeDropdown.append(
      "<option disabled selected>--Change date for Slot change--</option>"
    );
    SelectedtimeRangeDropdown.append(newOption);
    // modal
    //   .find('select[name="timeRangeEdit"]')
    SelectedtimeRangeDropdown.val(
      rowData.start_time + " - " + rowData.end_time
    );
    modal.find('textarea[name="motifPatient"]').val(rowData.motifPatient);
    modal.find('input[name="patientId"]').val(rowData.patientId);
    modal.find('input[name="appointmentId"]').val(rowData.id);
  } else {
    console.error("Row data not found.");
  }
});

// handle edit appointment
$("#editAppointmentForm").on("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  let date = $("input[name='dateEdit']").val();
  let timeRange = $("select[name='timeRangeEdit']").val();
  let motifPatient = $("textarea[name='motifPatient']").val();
  let patientId = $("input[name='patientId']").val();
  let appointmentID = $("input[name='appointmentId']").val();

  if (!timeRange) {
    $.getScript("./assets/js/toaster-custom.js", function () {
      showToast("info", "Please select time range");
    });
    return;
  }
  let [start_time, end_time] = timeRange.split(" - ");
  // Get form data
  let formData = {
    date,
    start_time,
    end_time,
    motifPatient,
    patientId,
    appointmentId: appointmentID,
  };

  // Check if any field is empty
  $(
    "input[name='dateEdit'], select[name='timeRangeEdit'],textarea[name='motifPatient']"
  ).each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });
  if (!isFormDataFilled(formData)) {
    return;
  }

  // Make AJAX request for API
  $.ajax({
    url: BASE_URL + "/api/v1/appointment/update-appointment/" + userId,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      // Handle successful response
      // console.log("API call successful:", response);
      if (response?.data) {
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", response?.data?.message);
        });
      }
      window.location.reload();
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error:", error);
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Something went wrong");
      });
    },
  });
  // console.log(formData);
});

// Filter by Date inside datatable

let minDateFilter_ = "";
let maxDateFilter_ = "";

$("#daterange.appointment").daterangepicker();
// Event handler for applying date range filter
$("#daterange.appointment").on("apply.daterangepicker", function (ev, picker) {
  minDateFilter_ = picker.startDate;
  maxDateFilter_ = picker.endDate;

  // Redraw the DataTable to apply the filtering
  appointmentTable.draw();
});

// Custom filtering function
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
  // Get the date from the column
  let date = new Date(data[1]); // Assuming the date is in the third column (index 2)

  // Perform date range filtering
  if (
    (!minDateFilter_ || date >= minDateFilter_) &&
    (!maxDateFilter_ || date <= maxDateFilter_)
  ) {
    return true; // Include row in the filtered result
  }
  return false; // Exclude row from the filtered result
});

// common functions

let imageKey = null; // Variable to store the image key
//let imageKey = bharatrandomimagekey86595695

// Handle change event of file input for image upload
$("#file-signup-1").change(function () {
  const file = $(this)[0].files[0];
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

// Function to upload image and get image key
function uploadImageAndGetKey(imageFile) {
  return new Promise(function (resolve, reject) {
    // Create FormData object to send image file
    let formData = new FormData();
    formData.append("image", imageFile);

    // Make AJAX request to upload image
    $.ajax({
      url: BASE_URL + "/api/v1/upload-image",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        // Image uploaded successfully, resolve with image key
        resolve(response.imageKey);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("success", "Image uploaded success!");
        });
      },
      error: function (xhr, status, error) {
        // Error uploading image, reject with error
        reject(error);
      },
    });
  });
}

function isFormDataFilled(formData) {
  for (let key in formData) {
    if (!formData[key]) {
      return false; // If any value is empty, return false
    }
  }
  return true; // All keys are filled
}

function formatYYYYMMDDDate(dateString) {
  // Create a new Date object from the provided date string
  let date = new Date(dateString);

  // Extract the year, month, and day components from the Date object
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if necessary
  let day = date.getDate().toString().padStart(2, "0"); // Add leading zero if necessary

  // Construct the formatted date string in "YYYY-MM-DD" format
  let formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
