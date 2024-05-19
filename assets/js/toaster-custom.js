function showToast(type, msg) {
  if (!msg) {
    msg = "no msg available ";
  }
  let toastBox = $("#toastBox");
  let iconClass;
  switch (type) {
    case "success":
      iconClass = "fa-check-circle";
      break;
    case "error":
      iconClass = "fa-times-circle";
      break;
    case "info":
      iconClass = "fa-exclamation-circle";

      break;
  }

  // Create icon element
  let icon = $("<i>").addClass("fas").addClass(iconClass);

  // Create message element
  let messageElement = $("<span>").addClass("message").text(msg);

  // Create toast element
  let toast = $("<div>")
    .addClass("toast show")
    .addClass(type)
    .append(icon)
    .append(messageElement);

  // Append toast to toastBox
  toastBox.append(toast);
  // console.log(toastBox);
  setTimeout(() => {
    toast.remove();
  }, [6000]);
}
