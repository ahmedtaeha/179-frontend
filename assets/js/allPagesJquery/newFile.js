$(document).ready(function () {
  if (!token) {
    window.location.href = "page-login.html";
  }

  // Function to handle logout button
  const logoutUser = () => {
    console.log("Logout clicked");
    // Redirect user to the logout page or perform any other actions
  };

  // Event listener for clicking on the logout anchor tag
  $("#index-logout").click(function (event) {
    // event.preventDefault();
    logoutUser();
  });
});
