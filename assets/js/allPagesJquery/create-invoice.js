// const { id: userId } = JSON.parse(localStorage.getItem("user_data"));
$(document).ready(function (e) {
  // Function to fetch patient data and update dropdown
  console.log("new-hehe");
  function fetchPatients() {
    $.ajax({
      url: BASE_URL + "/api/v1/users/get-patients/" + userId,
      method: "GET",
      success: function (response) {
        // Update dropdown with patient data
        console.log("getting", response);
        if (response?.data && response?.data?.length > 0) {
          let dropdown = $("select[name='patient']");
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
  fetchPatients();
});
