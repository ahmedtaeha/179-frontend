const token = localStorage.getItem("clinic_token");
// const { id: userId } = JSON.parse(localStorage.getItem("user_data"));
$(document).ready(function () {
  if (!token) {
    window.location.href = "page-login.html";
    return;
  }

  // Function to handle logout button

  const logoutUser = () => {
    localStorage.removeItem("clinic_token");
    window.location.href = "page-login.html";
  };

  // Event listener for clicking on the logout anchor tag
  $("#index-logout").click(function (event) {
    event.preventDefault();

    logoutUser();
  });

  // Get the username from localStorage
  let userdata = localStorage.getItem("user_data");
  const { name } = JSON.parse(userdata);

  // Update the greeting message
  let greetingMessage = getGreetingMessage();
  let updatedContent =
    greetingMessage +
    " <span class='names' id='user_full_name'>" +
    name +
    "</span>";

  // Update the content of the h4 element
  $("#greeting_doctor").html(updatedContent);

  // =================================================================

  function fetchPatients() {
    $.ajax({
      url: BASE_URL + "/api/v1/users/get-patients/" + userId,
      method: "GET",
      success: function (response) {
        console.log("getting", response);
        if (response?.data && response.data.length > 0) {
          // Reverse the order of the patient array
          var reversedPatients = response.data.reverse();

          // Take the first 10 patients from the reversed array
          var lastTenPatients = reversedPatients.slice(0, 10);

          // Clear the existing patient list
          $(".panel-body.widget-media.main-scroll.nicescroll-box ul").empty();

          // Iterate through the last 10 patients and populate the list
          lastTenPatients.forEach(function (patient, index) {
            // Create HTML elements for each patient
            var listItem = `<li class="list-group-item d-flex justify-content-between align-items-center media">
                                    <div class="d-flex">
                                        <div class="img-patient">
                                            <img src=
                                            ${
                                              patient?.image
                                                ? "https://d2ey23d163tyk1.cloudfront.net/" +
                                                  patient?.image
                                                : "https://via.placeholder.com/128/f8f8f8/2b2b2b"
                                            } class="rounded-circle" alt="people">
                                        </div>
                                        <div class="media-body">
                                            <h4 class="mb-0">${
                                              patient.firstName
                                            } ${patient.lastName}</h4>
                                            <span>${patient.martialStatus}, ${
              patient.address
            }</span>
                                        </div>
                                    </div>
                                    <button type="button" class="ms-btn-icon btn-success" name="button">
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                </li>`;

            // Append the HTML for this patient to the patient list
            $(".panel-body.widget-media.main-scroll.nicescroll-box ul").append(
              listItem
            );
          });
        }
      },
      error: function (error) {
        console.error("Error fetching patients:", error);
      },
    });
  }
  function fetchReports() {
    $.ajax({
      url: BASE_URL + "/api/v1/reports/get-stats/" + userId,
      method: "GET",
      success: function (response) {
        // Update dropdown with patient data
        console.log("reports data", response);
        if (response?.data) {
          // Update patient count
          if (response.data.patients && response.data.patients.length > 0) {
            $("#patient-report").text(response.data.patients[0].total_patients);
          }

          // Update appointment count
          if (
            response.data.appointments &&
            response.data.appointments.length > 0
          ) {
            $("#appointment-report").text(
              response.data.appointments[0].total_appointment
            );
          }

          // Update total revenue
          if (response.data.revenue && response.data.revenue.length > 0) {
            $(".in-demo-panelrevenue-report").text(
              "$" + response.data.revenue[0].total_revenue
            );
          }
        }
      },
      error: function (error) {
        console.error("Error fetching patients:", error);
      },
    });
  }
  fetchReports();
  fetchPatients();

  // Get today's date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var mm = monthNames[today.getMonth()]; // Get month name
  var yyyy = today.getFullYear();

  today = dd + " " + mm + " " + yyyy;

  // Update the card title with today's date
  $("#currentDateTitle").text("Appointment List | " + today);
});

// Function to get the greeting message
function getGreetingMessage() {
  // Get the current hour
  var currentHour = new Date().getHours();

  // Define the default greeting
  var greeting = "Good morning";

  // Update the greeting based on the current time
  if (currentHour >= 12 && currentHour < 18) {
    // Afternoon
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    // Evening
    greeting = "Good evening";
  }

  return greeting;
}
