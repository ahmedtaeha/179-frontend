$(document).ready(function () {
  const { email } = JSON.parse(localStorage.getItem("user_data"));
  if (email) {
    const socket = io("https://medicalapi.estulife.com");
    // console.log("bharat");
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    // console.log(email);
    socket.on(email, (data) => {
      console.log("Received response:", data);
      // Update UI with the received data
      //   {
      //     "email": "kks@gmail.com",
      //     "patient_name": "kkkksinghania",
      //     "paintent_image": "b16652f43278d09d64c650fe14006728",
      //     "date": "2024-04-30T00:00:00.000Z",
      //     "start_time": "08:30:00",
      //     "end_time": "09:00:00",
      //     "message": "kkkksinghania has an appointment with you on Tue Apr 30 2024 05:30:00 GMT+0530 (India Standard Time) from 08:30:00 to 09:00:00"
      // }
      handleNotification(data);
    });

    const sendMessage = () => {
      const message = document.getElementById("message-input").value;
      socket.emit("message", message);
    };
  }
});

// Function to handle incoming notifications
function handleNotification(notification) {
  // Create a list item for the notification
  let listItem =
    `
      <li>
          <div class="timeline-panel">
              <div class="media mr-2">
                  <img alt="image" src="` +
    `${
      notification.paintent_image
        ? "https://d2ey23d163tyk1.cloudfront.net/" +
          notification?.paintent_image
        : "https://via.placeholder.com/150/f8f8f8/2b2b2b"
    }` +
    '" alt="img">' +
    `</div>
              <div class="media-body">
                  <h6 class="mb-1">${notification.message}</h6>
                  <small class="d-block">${formatDate(notification.date)} - ${
      notification.start_time
    } to - ${notification.end_time}</small>
              </div>
          </div>
      </li>
  `;

  // Append the new notification to the list
  $("#notification-list").append(listItem);
}

// Function to format date
function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
