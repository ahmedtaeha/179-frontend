
"use strict";
const BASE_URL = "https://medicalapi.estulife.com";
$(function () {
  // Function to fetch and render appointments
  function fetchAppointments() {
    const { id: userId } = JSON.parse(localStorage.getItem("user_data"));
    // Assuming you have the AJAX call to fetch appointments
    let appointments = [];
    $.ajax({
      url: BASE_URL + "/api/v1/appointment/get-appointments/" + userId,
      type: "GET",
      dataType: "json",
      success: function (response) {
        // Parse and format appointment data
        appointments = response.data.appointments.map(function (appointment) {
          // Extract date and time components

          // Parse the start date string
          const startDate = new Date(appointment?.date);

          startDate.setHours(appointment?.start_time?.slice(0, 2));
          startDate.setMinutes(appointment?.start_time?.slice(3, 5));
          startDate.setSeconds(0);

          // end date
          const endDate = new Date(appointment?.date);

          endDate.setHours(appointment?.end_time?.slice(0, 2));
          endDate.setMinutes(appointment?.end_time?.slice(3, 5));
          endDate.setSeconds(0);

          return {
            title:
              appointment.patient.firstName +
              " " +
              appointment.patient.lastName,
            start: new Date(startDate), //removing 07:30:00-->07:30
            end: new Date(endDate), //removing 08:0:00-->08:00
            backgroundColor:
              appointment.appointmentStatus === "pending"
                ? "#9e5fff" //purple if pending
                : "#ff4040", // Different colors for pending and cancelled appointments red
            borderColor:
              appointment.appointmentStatus === "pending"
                ? "#9e5fff" // purple if  pending
                : "#ff4040", // Border colors red if cancelled
            appointmentId: appointment.id, // Custom property to store appointment ID
            motif: appointment?.motifPatient,
            appointmentStatus: appointment?.appointmentStatus,
            gender: appointment?.patient?.gender,
            diseases: appointment?.patient?.diseases,
            patientHistory: appointment?.patient?.patientHistory,
            appointStartTime: appointment?.start_time?.slice(0, 5),
            appointEndTime: appointment?.end_time?.slice(0, 5),
          };
        });

        // Render appointments on the calendar
        $("#calendar").fullCalendar("renderEvents", appointments, true);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching appointments:", error);
      },
    });

    // Initialize FullCalendar
    $("#calendar").fullCalendar({
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay",
      },
      buttonText: {
        today: "today",
        month: "month",
        week: "week",
        day: "day",
      },
      editable: true,
      droppable: true,
      eventClick: function (event, jsEvent, view) {
        $("#modalEventTitle").text(event.title);
        $("#modalEventStart").text(event.start.format("YYYY-MM-DD"));
        $("#modalEventStartTime").text(event.appointStartTime);
        $("#modalEventEndTime").text(event.appointEndTime);
        $("#modalEventMotif").text(event.motif);
        $("#modalEventAppointmentStatus").text(event.appointmentStatus);
        $("#modalEventGender").text(event.gender);
        $("#modalEventStartDiseases").text(event.diseases);
        $("#modalEventStartPatientHistory").text(event.patientHistory);
        // Add more event details to the modal as needed

        // Show the modal
        $("#eventModal").modal("show");
      },
      eventDrop: function (event, delta, revertFunc) {
        // Calculate new start and end times
        const newDate = event.start.format("YYYY-MM-DD"); // New date
        // console.log(newDate, event);

        const eventData = {
          date: newDate,
          appointmentId: event.appointmentId,
          userId,
        };
        // Make AJAX call to update the appointment date
        $.ajax({
          url: BASE_URL + "/api/v1/appointment/update-appointment/" + userId,
          type: "PUT",
          contentType: "application/json", // Specify content type as JSON
          data: JSON.stringify(eventData), // Convert data object to JSON string
          success: function (response) {
            // Appointment date updated successfully
            $.getScript("./assets/js/toaster-custom.js", function () {
              showToast("success", response?.data?.message);
            });
            $("#calendar").fullCalendar("removeEvents", event.id);

            fetchAppointments();
          },
          error: function (xhr, status, error) {
            // Handle error
            console.error("Error updating appointment date:", error);
            if (xhr.status === 403) {
              let errRes = xhr.responseJSON;
              $.getScript("./assets/js/toaster-custom.js", function () {
                showToast("error", errRes?.message);
              });
              response?.data?.message;
            }
            // Revert the event back to its original position
            revertFunc();
          },
        });
      },
    });
    // Close modal when "Close" button or close (X) button is clicked
    $("#closeModalButton").click(function () {
      $("#eventModal").modal("hide");
    });
    $("#closeModalCrossButton").click(function () {
      $("#closeModalButton").click();
    });
    function displayAppointmentDetails(appointment) {

      $("#appointmentModalTitle").text(appointment.title);
      $("#appointmentModalBody").text(
        "Start Time: " + appointment.start.format("YYYY-MM-DD HH:mm")
      );
      $("#appointmentModal").modal("show");
    }

    function hideAppointmentDetails() {
      // Hide the modal when mouse leaves the appointment
      $("#appointmentModal").modal("hide");
    }
  }
  // Call fetchAppointments function on page load
  fetchAppointments();

  function init_events(ele) {
    ele.each(function () {
      // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
      // it doesn't need to have a start or end
      var eventObject = {
        title: $.trim($(this).text()), // use the element's text as the event title
      };

      // store the Event Object in the DOM element so we can get to it later
      $(this).data("eventObject", eventObject);

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 1070,
        revert: true, // will cause the event to go back to its
        revertDuration: 0, //  original position after the drag
      });
    });
  }

  init_events($("#external-events div.external-event"));

});
