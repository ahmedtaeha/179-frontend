$(function () {
  // ========================================================================= //
  // logout button action
  // ========================================================================= //
  jQuery(".logout").click(function (event) {
    // Event listener for clicking on the logout anchor tag
    event.preventDefault();
    const token = localStorage.getItem("clinic_token");
    if (!token) {
      window.location.href = "page-login.html";
    }

    // Function to handle logout button

    const logoutUser = () => {
      localStorage.removeItem("clinic_token");
      localStorage.removeItem("user_data");
      window.location.href = "page-login.html";
    };

    logoutUser();
  });

  // ========================================================================= //
  //    Add remove class active has menu
  // ========================================================================= //

  // calling userProfileDataFromStorage
  userProfileDataFromStorage();

  // ========================================================================= //
  //    Add remove class active has menu
  // ========================================================================= //

  jQuery(".has-submenu").click(function () {
    $(".has-submenu").removeClass("active");
    $(this).toggleClass("active");
  });

  // ========================================================================= //
  //    Toggle Aside Menu
  // ========================================================================= //

  jQuery(".hamburger").click(function () {
    jQuery("body").toggleClass("sidebar-toggled");
    jQuery("#main-wrapper").toggleClass("menu-toggle");
    jQuery(".left-panel").toggleClass("collapsed");
  });

  // ========================================================================= //
  //    Set attibute isnide body (Light)
  // ========================================================================= //

  jQuery("body").attr({
    "data-typography": "rubik",
    "data-sidebar-position": "fixed",
    "data-header-position": "fixed",
  });

  // ========================================================================= //
  //    Set attibute isnide body (Dark)
  // ========================================================================= //

  if (jQuery("body").hasClass("dark")) {
    jQuery("body").attr("data-theme-version", "dark");
    jQuery("body").attr("data-nav-headerbg", "primary_color_3");
    jQuery("body").attr("data-headerbg", "primary_color_3");
    jQuery("body").attr("data-sibebarbg", "primary_color_3");
    // jQuery('body').attr('data-primary', 'primary_color_3');
    jQuery("body").attr("data-sibebartext", "primary_color_3");
    //jQuery('body').attr('data-topbar', 'primary_color_3');
    jQuery("body").attr("data-sidebar", "primary_color_3");
    jQuery(".brand-title").attr("src", "assets/images/logo-dark.png");
  }

  // ========================================================================= //
  //   Top bar change
  // ========================================================================= //

  if ($(".auth").hasClass("dark")) {
    $(".logo img").attr("src", "assets/images/logo-dark.png");
  }

  // ========================================================================= //
  //    resize
  // ========================================================================= //

  function resize() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      $("body").attr("data-sidebar-style", "overlay");
    } else if (window.matchMedia("(max-width: 1199px)").matches) {
      $("body").attr("data-sidebar-style", "mini");
    } else {
      // $('body').attr('data-sidebar-style', 'full');
      // $("#main-wrapper").removeClass('mini');
    }
  }

  resize();

  jQuery(window).resize(function () {
    resize();
  });
});

function userProfileDataFromStorage() {
  // Retrieve user data from localStorage to update header data
  const userData = JSON.parse(localStorage.getItem("user_data"));
  // console.log(userData);

  if (userData) {
    // Update header with user data
    $(".header-info span")
      .text(userData.name)
      .attr("title", "Click to sign out");
    $(".header-info small").text(userData.role);
    $(".header-profile img")
      .attr(
        "src",
        userData.image == null ||
          userData.image == "bharatrandomimagekey86595695" ||
          userData.image == "profile.jpg"
          ? "https://via.placeholder.com/150/f8f8f8/2b2b2b"
          : "https://d2ey23d163tyk1.cloudfront.net/" + userData.image
      )
      .attr("title", userData.role);
  }
}

// ========================================================================= //
//    upload image in drag
// ========================================================================= //

function showPreview(event) {
  if (event.target.files.length > 0) {
    var src = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("file-ip-1-preview");
    preview.src = src;
    preview.style.display = "block";
  }
}

// ========================================================================= //
//   Preview Pictures
// ========================================================================= //

$(".widget-3 input[type='file']").on("change", function () {
  $(".widget-3").addClass("custom-text");
});

// ========================================================================= //
//   Date Range
// ========================================================================= //

$('input[name="daterange"]').daterangepicker(
  {
    opens: "right",
  },
  function (start, end, label) {
    console.log(
      "A new date selection was made: " +
        start.format("YYYY-MM-DD") +
        " to " +
        end.format("YYYY-MM-DD")
    );
  }
);

// ========================================================================= //
//  Change dates patient
// ========================================================================= //

$(function () {
  $('input[name="dates"]').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      minYear: 1901,
      maxYear: parseInt(moment().format("YYYY"), 10),
    },
    function (start, end, label) {
      var years = moment().diff(start, "years");
    }
  );
});

// ========================================================================= //
//   refrech select picker inside modal
// ========================================================================= //
$(".selectRefresh").on("shown", function () {
  $(".selectpicker").selectpicker("refresh");
});

// ========================================================================= //
//   Responsive
// ========================================================================= //

function resize() {
  if (window.matchMedia("(max-width: 1199px)").matches) {
    $(".has-submenu").removeClass("active");
  }
}

resize();

jQuery(window).resize(function () {
  resize();
});

jQuery(function ($) {
  var path = window.location.href;
  $("ul li a").each(function () {
    if (
      window.matchMedia("(max-width: 1199px) and (max-width: 1199px)").matches
    ) {
      if (this.href === path) {
        if ($(this).parent().hasClass("has-submenu")) {
          $(this).parent().addClass("active-submenu");
        } else {
          $(this).parent().parent().parent().addClass("active-submenu");
        }
      }
    }
  });
});

// ===========================================
// numeric inputs
// ===========================================
$(".numeric-input").on("input", function (event) {
  let value = $(this).val();
  // Replace non-numeric characters (except dot and minus sign)
  value = value.replace(/[^0-9.-]/g, "");

  // Remove leading zeros
  value = value.replace(/^0+/, "");

  // Remove leading minus sign if it's not the first character
  value = value.replace(/^-/, "");

  // Remove leading dot if it's the first character
  if (value.length > 1 && value[0] === ".") {
    value = value.slice(1);
  }

  // Update the input field value
  $(this).val(value);
});

// ===========================================
// numeric inputs
// ===========================================
$(".numeric-input-otp").on("input", function (event) {
  let value = $(this).val();
  // Replace non-numeric characters (except dot and minus sign)
  value = value.replace(/[^0-9.-]/g, "");

  // Remove leading minus sign if it's not the first character
  value = value.replace(/^-/, "");

  // Remove leading dot if it's the first character
  if (value.length > 1 && value[0] === ".") {
    value = value.slice(1);
  }

  // Update the input field value
  $(this).val(value);
});
