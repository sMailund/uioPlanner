/*jshint esversion: 6 */

//TODO: untangle the spaghetti

let jquery = require('jquery');
let http = require('http');

let courses = [];
let numberOfCourses = 0;

$(document).ready(function() {
  $("#addCourse").click(function() {
    _getJSON($('#courseSearchBox').val());
  });
});

//TODO: error handling

function _getJSON(course) {
  let url = '/api/course?code=' + $('#courseSearchBox').val();
  http.get(url, function(res){
    let body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        let response = JSON.parse(body);
        numberOfCourses++;
        courses[numberOfCourses] = response; //add json to courses
        _createCourseBox(numberOfCourses);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

function _createCourseBox(number) {

  //create new div
  $("#courses").append(
    $('<div />')
    .attr("id", "course" + number)
      .append(
        $("<h2 />")
        .text(courses[number][0].coursecode)
      )
      .append(
        $('<div />')
        .attr("id", "course" + number + "felles")
        .append(
          $('<h3 />')
          .text("Fellesundervisning")
        )
      )
      .append(
        $('<div />')
        .attr("id", "course" + number + "gruppe")
        .append(
          $('<h3 />')
          .text("Gruppeundervisning")
        )
      )
    );

    let fellesDiv = $("#course" + number + "felles");
    _createActivities(courses[number][0].activities.Fellesundervisning,
                      number,
                      fellesDiv);

    let gruppeDiv = $("#course" + number + "gruppe");
    _createActivities(courses[number][0].activities.Gruppeundervisning,
                      number,
                      gruppeDiv);

    //add click handler to button in added div
    $("#course" + number).on("click", "button#addLecture", function() {
      external(number);
    });
}

function _createActivities(activities, coursenum, div) {
  let activityNum = 0;

  activities.forEach(function(activity) {

    let checkboxId = "course" + coursenum + "activity" + activityNum++;

    div.append(
      $('<input />')
        .attr("type", "checkbox")
        .attr("id", checkboxId)
    );

    div.append(
      $('<label />')
        .attr("for", checkboxId)
        .text(activity.title)
    );

    div.append(
      $('<br>')
    );
  });
}

function external(number) {
  console.log(courses[number][0].activities);
}
