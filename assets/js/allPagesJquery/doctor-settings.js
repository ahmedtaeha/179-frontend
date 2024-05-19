$(document).ready(function () {
  // Make AJAX request to your API
  const { id: userId } = JSON.parse(localStorage.getItem("user_data"));

  $.ajax({
    url: BASE_URL + "/api/v1/users/settings/" + userId,
    type: "GET",
    success: function (response) {
      // Handle successful response
      console.log("API call successful:", response);
      handlePresetDoctorFields(response?.data);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error:", error, xhr);
      let errRes = xhr.responseJSON;
      if (xhr.status === 403) {
        //403--> patient already created
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", errRes?.message);
        });
      }
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Something went wrong with getting doctor info");
      });
      window.location.href = "index.html";
    },
  });

  function handlePresetDoctorFields(APIData) {
    console.log(APIData, "api data inside function");
    let doctorForm = $("#doctorForm");
    doctorForm.find("input[name='firstName']").val(APIData.firstName);
    doctorForm.find("input[name='lastName']").val(APIData.lastName);
    doctorForm.find("input[name='address']").val(APIData.address);
    doctorForm.find("input[name='mobile']").val(APIData.mobileNo);
    doctorForm.find("input[name='email']").val(APIData.email);
    doctorForm.find("select[name='language']").val(APIData.languages);
    doctorForm
      .find("select[name='appointmentInterval']")
      .val(APIData.appointment_interval);

    let scheduleData = JSON.parse(APIData.schedule);
    console.log(scheduleData);

    scheduleData.forEach(function (schedule) {
      console.log(schedule);
      switch (schedule?.day) {
        case "Sunday":
          doctorForm
            .find("input[name='sunday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='sunday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Monday":
          doctorForm
            .find("input[name='monday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='monday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Tuesday":
          doctorForm
            .find("input[name='tuesday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='tuesday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Wednesday":
          doctorForm
            .find("input[name='wednesday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='wednesday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Thursday":
          doctorForm
            .find("input[name='thursday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='thursday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Friday":
          doctorForm
            .find("input[name='friday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='friday_end_time']")
            .val(schedule?.endTime);
          break;

        case "Saturday":
          doctorForm
            .find("input[name='saturday_start_time']")
            .val(schedule?.startTime);
          doctorForm
            .find("input[name='saturday_end_time']")
            .val(schedule?.endTime);
          break;
        default:
          console.log("no data");
      }
    });
    doctorForm.find("input[name='sundat_start_time']").val(scheduleData);
  }

  $("#doctorForm").on("submit", function (event) {
    event.preventDefault();
    console.log("form submitting");

    let doctorForm = $("#doctorForm");
    let doctor_first_name = doctorForm.find("input[name='firstName']").val();
    let doctor_last_name = doctorForm.find("input[name='lastName']").val();
    let doctor_address = doctorForm.find("input[name='address']").val();

    let doctor_language = doctorForm.find("select[name='language']").val();
    let doctor_appointment_interval = doctorForm
      .find("select[name='appointmentInterval']")
      .val();

    let monday_start_time = doctorForm
      .find("input[name='monday_start_time']")
      .val();
    let monday_end_time = doctorForm
      .find("input[name='monday_end_time']")
      .val();
    let tuesday_start_time = doctorForm
      .find("input[name='tuesday_start_time']")
      .val();
    let tuesday_end_time = doctorForm
      .find("input[name='tuesday_end_time']")
      .val();
    let wednesday_start_time = doctorForm
      .find("input[name='wednesday_start_time']")
      .val();
    let wednesday_end_time = doctorForm
      .find("input[name='wednesday_end_time']")
      .val();
    let thursday_start_time = doctorForm
      .find("input[name='thursday_start_time']")
      .val();
    let thursday_end_time = doctorForm
      .find("input[name='thursday_end_time']")
      .val();
    let friday_start_time = doctorForm
      .find("input[name='friday_start_time']")
      .val();
    let friday_end_time = doctorForm
      .find("input[name='friday_end_time']")
      .val();
    const requestData = {
      firstName: doctor_first_name,
      lastName: doctor_last_name,
      address: doctor_address,
      appointment_interval: doctor_appointment_interval, // please add in minute only.
      language: doctor_language,
      schedule: {
        Monday: {
          startTime: monday_start_time,
          endTime: monday_end_time,
        },
        Tuesday: {
          startTime: tuesday_start_time,
          endTime: tuesday_end_time,
        },
        Wednesday: {
          startTime: wednesday_start_time,
          endTime: wednesday_end_time,
        },
        Thursday: {
          startTime: thursday_start_time,
          endTime: thursday_end_time,
        },
        Friday: {
          startTime: friday_start_time,
          endTime: friday_end_time,
        },
      },
    };
    // Make the PUT AJAX call
    $.ajax({
      url: BASE_URL + "/api/v1/users/settings/" + userId,
      method: "PUT",
      contentType: "application/json", // Specify the content type of the request body
      data: JSON.stringify(requestData), // Convert the data object to a JSON string
      success: function (response, textStatus, jqXHR) {
        console.log("PUT request successful");
        console.log("Response:", response);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast(
            "success",
            response?.data?.status
              ? response?.data?.status
              : "Data Saved Successfully!"
          );
        });
        // localStorage.setItem("clinic_token", response?.data?.token);
        localStorage.setItem("user_data", JSON.stringify(response?.data?.user));
        let user_data = JSON.parse(localStorage.getItem("user_data"));
        if (user_data) {
          $.getScript("./assets/js/main.js", function () {
            userProfileDataFromStorage();
          });
        } else {
          window.location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("PUT request failed");
        console.error("Error:", errorThrown);
        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Something went wrong while saving data");
        });
      },
    });
  });
});
