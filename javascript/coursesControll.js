var jquery = require('jquery');

//TODO: er det en bedre måte å legge til html?
$(document).ready(function() {
  $("#addCourse").click(function() {
    $("#courses").append(
    "<div>" +
      "hello" +
      '<button id="addedbutton">world</button>' +
    "</div>");
  });
  $("#courses").on("click", "button#addedbutton", function() {
    external();
  });
});

function external() {
  alert("it works");
}
