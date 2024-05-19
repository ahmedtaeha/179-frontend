// const { id: userId } = JSON.parse(localStorage.getItem("user_data"));
console.log("new-prescription");
$(document).ready(function () {
  // Function to fetch patient data and update dropdown
  function fetchPatients() {
    $.ajax({
      url: BASE_URL + "/api/v1/users/get-patients/" + userId,
      method: "GET",
      success: function (response) {
        // Update dropdown with patient data
        console.log("getting", response);
        if (response?.data && response?.data?.length > 0) {
          let dropdown = $("#patient-dropdown");
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

  function fetchAppointmentTimeList(day) {
    $.ajax({
      url: BASE_URL + "/api/v1/appointment/get/" + userId + "/" + day,
      method: "GET",
      success: function (response) {
        // Update dropdown with appointment list data
        if (
          response?.data &&
          response?.data?.appointmentsList?.slots?.length > 0
        ) {
          let dropdown = $("#appointmentlist-time-slots");
          dropdown.empty();
          dropdown.append(
            "<option disabled selected>---Select Time Slot---</option>"
          );
          $.each(
            response?.data?.appointmentsList?.slots,
            function (index, slot) {
              dropdown.append(
                $("<option></option>")
                  .attr("value", slot.startTime + " - " + slot.endTime)
                  .attr("title", slot.day)
                  .text(slot.startTime + " - " + slot.endTime)
              );
            }
          );
        }
      },
      error: function (error) {
        console.error("Error fetching Time Slots:", error);

        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Something went wrong");
        });
      },
    });
  }
  $("#new-appointmentbutton").on("click", function () {
    fetchPatients();
  });
  $("#appointment-add-input").on("input", function () {
    let inputDate = $("#appointment-add-input").val();
    let day = getDayOfWeek(inputDate);
    console.log(day);

    let dropdown = $("#appointmentlist-time-slots");
    dropdown.empty();
    if (day === "Saturday" || day === "Sunday") {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Doctor not working on" + " " + day);
        dropdown.append(
          "<option disabled selected>---Doctor not available---</option>"
        );
      });
    } else {
      fetchAppointmentTimeList(day);
    }
  });
  $("#appointment-date-input-edit").on("change", function () {
    console.log("bharat");
    let inputDate = $("#appointment-date-input-edit").val();
    let day = getDayOfWeek(inputDate);
    console.log(day);

    let dropdown = $("#appointment-timerange-dropdown");
    dropdown.empty();
    dropdown.append(
      "<option disabled selected>---change date for Slot change---</option>"
    );
    if (day === "Saturday" || day === "Sunday") {
      $.getScript("./assets/js/toaster-custom.js", function () {
        showToast("error", "Doctor not working on" + " " + day);
        dropdown.append(
          "<option disabled selected>---Doctor not available---</option>"
        );
      });
    } else {
      fetchAppointmentTimeListEdit(day);
    }
  });
  function fetchAppointmentTimeListEdit(day) {
    $.ajax({
      url: BASE_URL + "/api/v1/appointment/get/" + userId + "/" + day,
      method: "GET",
      success: function (response) {
        // Update dropdown with appointment list data
        if (
          response?.data &&
          response?.data?.appointmentsList?.slots?.length > 0
        ) {
          let dropdown = $("#appointment-timerange-dropdown");
          dropdown.empty();
          dropdown.append(
            "<option disabled selected>---Select Time Slot---</option>"
          );
          $.each(
            response?.data?.appointmentsList?.slots,
            function (index, slot) {
              dropdown.append(
                $("<option></option>")
                  .attr("value", slot.startTime + " - " + slot.endTime)
                  .attr("title", slot.day)
                  .text(slot.startTime + " - " + slot.endTime)
              );
            }
          );
        }
      },
      error: function (error) {
        console.error("Error fetching Time Slots:", error);

        $.getScript("./assets/js/toaster-custom.js", function () {
          showToast("error", "Something went wrong");
        });
      },
    });
  }
});
function getDayOfWeek(dateString) {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(dateString);
  let dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}
