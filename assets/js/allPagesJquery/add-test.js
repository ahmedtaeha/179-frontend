$(document).ready(function () {
  // Hide the file upload inputs
  //   $(".file-upload-input").hide();
  let uploadedFiles = [];

  // Handle adding files
  $("#add-file-button").click(function () {
    let fileInput = $("#file-upload")[0];

    if (fileInput.files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    let uploadPromises = [];
    for (let i = 0; i < fileInput.files.length; i++) {
      let file = fileInput.files[i];
      uploadPromises.push(uploadFileAndGetKey(file));
    }

    Promise.all(uploadPromises)
      .then(function (responses) {
        responses.forEach(function (response) {
          // Add the file info to the uploadedFiles array
          console.log("bharat");
          uploadedFiles.push({
            key: response.key,
            filetype: response.filetype,
            filePath: response.filePath, // Use filePath for UI display
          });

          // Display the uploaded file on the UI
          let fileDisplay = "";
          if (response.filetype.startsWith("image")) {
            fileDisplay = `<img src="${response.filePath}" alt="${response.key}" class="uploaded-file-thumbnail" style="max-width: 100px; max-height: 100px; cursor: pointer;" />`;
          } else if (response.filetype.startsWith("video")) {
            fileDisplay = `<video src="${response.filePath}" controls class="uploaded-file-thumbnail" style="max-width: 100px; max-height: 100px; cursor: pointer;"></video>`;
          } else if (response.filetype === "application/pdf") {
            fileDisplay = `<span class="uploaded-file-pdf" style="cursor: pointer;">PDF: ${response.key}</span>`;
          }

          $("#uploaded-files-list").append(`
            <div class="uploaded-file-item" data-file-path="${response.filePath}">
              ${fileDisplay}
            </div>
          `);

          // Clear the file input
          fileInput.value = "";
        });

        // Add click event to navigate to file on click
        $(".uploaded-file-item").click(function () {
          let filePath = $(this).data("file-path");
          window.open(filePath, "_blank");
        });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      });
  });
  function uploadFileAndGetKey(file) {
    return new Promise(function (resolve, reject) {
      let fileData = new FormData();
      fileData.append("file", file);

      $.ajax({
        url: BASE_URL + "/api/v1/public/upload",
        method: "POST",
        data: fileData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (
            response &&
            response.data &&
            response.data.key &&
            response.data.filetype &&
            response.data.filePath
          ) {
            resolve({
              key: response.data.key,
              filetype: response.data.filetype,
              filePath: response.data.filePath,
            });
          } else {
            reject(new Error("Failed to upload file."));
          }
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  // Handle form submission
  $("#addTestForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    let name = $('input[name="name"]').val();
    let description = $('input[name="description"]').val();

    let formData = {
      name,
      description,
      uploads: uploadedFiles,
    };

    // Check if any field is empty
    $("select, input,textarea").each(function () {
      // Check if the input is not for uploading files
      if (!$(this).hasClass("file-upload-input")) {
        // Check if the input is empty or null
        if ($(this).val() === "" || $(this).val() === null) {
          // Add 'is-invalid' class to invalid inputs
          $(this).addClass("is-invalid");
        } else {
          // Remove 'is-invalid' class from valid inputs
          $(this).removeClass("is-invalid");
        }
      }
    });
    if (!isFormDataFilled(formData)) {
      return;
    }

    handleSubmitTest(formData);
  });

  function handleSubmitTest(requestData) {
    $.ajax({
      url: BASE_URL + "/api/v1/test/add-test",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        console.log(response);
        if (response?.data) {
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", "Test added successfully");
            $("#addTestForm")[0].reset();
            $("#uploaded-files-list").empty();
            uploadedFiles = [];
            setTimeout(() => {
              window.location.href = "/all-tests.html";
            }, [1800]);
          });
        }
      },
      error: function (error) {
        console.error("Error adding test:", error);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Error adding test");
        });
      },
    });
  }

  function isFormDataFilled(data) {
    return Object.values(data).every((value) => value !== "");
  }
});
