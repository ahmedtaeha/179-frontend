const BASE_URL = "https://medicalapi.estulife.com";

const { id: userId } = JSON.parse(localStorage.getItem("user_data"));
$(document).ready(function () {
  // Function to fetch patient data and update dropdown
  console.log("new-prescription");
  function fetchPatients() {
    $.ajax({
      url: BASE_URL + "/api/v1/users/get-patients/" + userId,
      method: "GET",
      success: function (response) {
        // Update dropdown with patient data
        console.log("getting", response);
        if (response?.data && response?.data?.length > 0) {
          var dropdown = $(".form-control#patient-dropdown");
          dropdown.empty();
          dropdown.append(
            "<option disabled selected>---Select Patient---</option>"
          );
          $.each(response?.data, function (index, patient) {
            dropdown.append(
              $("<option></option>")
                .attr("value", patient.id)
                .attr("title", `id ${patient.id}`)
                .text(patient.firstName + " " + patient.lastName)
            );
          });
        }
      },
      error: function (error) {
        console.error("Error fetching patients:", error);
      },
    });
  }

  let drugStructure = "";
  // Function to fetch drug list data
  function fetchDrugsList() {
    $.ajax({
      url: BASE_URL + "/api/v1/drugs/get-drugs",
      method: "GET",
      success: function (response) {
        // Update UI with drug list data
        console.log(response, "drug list");
        if (
          response?.data &&
          response?.data?.drugs &&
          response?.data?.drugs?.length > 0
        ) {
          var drugsList = $(".drugslist");
          drugsList.empty();
          drugStructure =
            `<div class="row drug">` +
            '<div class="col-md-2">' +
            `<div class="form-group"><input type="text" class="form-control" placeholder="Type" name="drug-type"></div>` +
            `</div>` +
            `<div class="col-md-6">` +
            `<div class="form-group">` +
            `<select class="form-control form-select" name="drug-name"> <option disabled selected value="">---Select Drug---</option>`;
          // <option value="19">csdfsff</option><option value="20">test trade name</option> </select>

          $.each(response?.data?.drugs, function (index, drug) {
            drugStructure += `<option>${drug.name}</option>`;
          });
          drugStructure +=
            `</select>` +
            `</div>
                  </div>` +
            `<div class="col-md-4">
                      <div class="form-group"> <input type="text" class="form-control" placeholder="Mg/Ml" name="drug-mg"></div>
                  </div>` +
            `<div class="col-md-6">
                      <div class="form-group"> <input type="text" class="form-control" placeholder="Dose" name="drug-dose"> </div>
                  </div>` +
            `<div class="col-md-6">
                      <div class="form-group"> <input type="text" class="form-control" placeholder="Duration" name="drug-duration"> </div>
                  </div>` +
            `<div class="col-md-12">
                      <div class="form-group"> <input type="text" class="form-control" placeholder="Advice/Comment" name="drug-advice"></div>
                  </div>` +
            `<div class="col-md-12 text-end">
                      <a class="btn btn-danger btn-remove-drug">Remove</a>
                  </div>` +
            `</div>` +
            `<hr/>`;
        }
      },
      error: function (error) {
        console.error("Error fetching drugs list:", error);
      },
    });
  }

  let testStructure = "";
  // Function to fetch test list data
  function fetchTestList() {
    $.ajax({
      url: BASE_URL + "/api/v1/test/get-tests",
      method: "GET",
      success: function (response) {
        // Update UI with test list data
        console.log(response, "test");
        if (
          response?.data &&
          response?.data?.tests &&
          response?.data?.tests?.length > 0
        ) {
          var testList = $(".addTest");
          testList.empty();
          testStructure =
            '<div class="row test">' +
            '<div class="col-md-6">' +
            '<div class="form-group">' +
            '<select class="form-control form-select" name="test-dropdown">' +
            "<option disabled selected>---Select Test---</option>";

          $.each(response?.data?.tests, function (index, test) {
            testStructure += `<option>${test.name}</option>`;
          });

          testStructure +=
            "</select>" +
            "</div>" +
            "</div>" +
            '<div class="col-md-6">' +
            '<div class="form-group">' +
            '<input type="text" class="form-control" placeholder="Description" name="test-description">' +
            "</div>" +
            "</div>" +
            `<div class="col-md-12 text-end">
                      <a class="btn btn-danger btn-remove-test">Remove</a>
                  </div>` +
            "</div>" +
            "<hr/>";
        }
      },
      error: function (error) {
        console.error("Error fetching test list:", error);
      },
    });
  }

  // Call fetchPatients() when the page loads
  fetchPatients();
  fetchDrugsList();
  fetchTestList();

  // ========================================================================= //
  //   Button Add Drugs
  // ========================================================================= //
  $("#butonAddDrug").click(function () {
    $(".drugslist").append(drugStructure);
    // $('select').selectpicker();
  });

  // ========================================================================= //
  //  Button Add Test
  // ========================================================================= //

  $("#butonAddTest").click(function () {
    $(".addTest").append(testStructure);
    // $('select').selectpicker();
  });

  // ========================================================================= //
  //  Remove Drug
  // ========================================================================= //
  $(document).on("click", ".btn-remove-drug", function () {
    $(this).closest(".drug").remove();
  });

  // ========================================================================= //
  //  Remove Test
  // ========================================================================= //
  $(document).on("click", ".btn-remove-test", function () {
    $(this).closest(".test").remove();
  });

  // =====================================================
  //   Add Prescription
  // =====================================================

  $("#prescription-form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    // Gather data from the form
    let patientId = $("#patient-dropdown").val();
    let drugs = [];
    let tests = [];

    let hasInvalidDrug = false;
    let hasInvalidTest = false;

    // Gather drug data
    $(".drugslist .drug").each(function () {
      let drugType = $(this).find("input[name='drug-type']").val();
      let drugName = $(this).find("select[name='drug-name']").val();
      let drugMg = $(this).find("input[name='drug-mg']").val();
      let drugDose = $(this).find("input[name='drug-dose']").val();
      let drugDuration = $(this).find("input[name='drug-duration']").val();
      let drugAdvice = $(this).find("input[name='drug-advice']").val();

      if (
        !drugType ||
        !drugName ||
        !drugMg ||
        !drugDose ||
        !drugDuration ||
        !drugAdvice
      ) {
        hasInvalidDrug = true;
      }

      drugs.push({
        type: drugType,
        name: drugName,
        mg: drugMg,
        dose: drugDose,
        duration: drugDuration,
        advice: drugAdvice,
      });
    });

    // Gather test data
    $(".addTest .test").each(function () {
      var testName = $(this).find("select[name='test-dropdown']").val();
      var testDescription = $(this)
        .find("input[name='test-description']")
        .val();

      if (!testName || !testDescription) {
        hasInvalidTest = true;
      }
      tests.push({
        name: testName,
        description: testDescription,
      });
    });

    // Prepare data for API request
    let requestData = {
      patientId: patientId,
      drugs: drugs,
      tests: tests,
    };
    console.log(requestData, "requestData");
    if (!patientId) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please select patient");
      });
    } else if (tests.length == 0 && drugs.length == 0) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please select atleast 1 tests or drug");
      });
    } else if (hasInvalidDrug) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please fill out all drug fields");
      });
    } else if (hasInvalidTest) {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("info", "Please fill out all test fields");
      });
    } else {
      // all checked
      //   Send data to the API endpoint
      $.ajax({
        url: BASE_URL + "/api/v1/prescription/add-prescription/" + userId,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function (response) {
          console.log("Prescription added successfully:", response);
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("success", response?.data?.message);
          });
          setTimeout(() => {
            window.location.href = "/all-prescriptions.html";
          }, [2000]);
          // Optionally, display a success message or redirect the user
        },
        error: function (xhr, status, error) {
          console.error("Error adding prescription:", error);
          $.getScript("./assets/js/toaster-custom.js", function () {
            showToast("error", "Something went wrong. Please try again");
          });
        },
      });
    }
    console.log("form submitting", patientId);
  });
});
