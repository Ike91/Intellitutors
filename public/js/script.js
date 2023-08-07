function updateContentSection() {
  var currentURL = window.location.pathname;
  var sectionContent = "";

  if (currentURL === "/users") {
    sectionContent =
      "<h2>Users Page</h2><p>This is the content for the Users page.</p>";
  } else if (currentURL === "/statistics") {
    sectionContent =
      "<h2>Statistics Page</h2><p>This is the content for the Statistics page.</p>";
  }

  $("#content-section").html(sectionContent);
}

$(document).ready(function () {
  updateContentSection();

  $(window).on("popstate", function () {
    updateContentSection();
  });
});
