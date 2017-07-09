/*jshint esversion: 6 */

//TODO: untangle the spaghetti
//TODO: comments

let jquery = require('jquery');
let http = require('http');
let calendar = require('./calendarControll.js');

let courses = []; //TODO: Dette kan kanskje fjernes hvis den ikke brukes
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
        courses[numberOfCourses] = response; //add json to courses
        _createCourseBox(numberOfCourses);
        numberOfCourses++;
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
    .addClass("courseContainer")
    .data("courseId", courses[number][0].course_id)
      .append(
        $("<h2 />")
        .text(courses[number][0].course_id)
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

    let fellesAktiviteter = courses[number][0].activities.Fellesundervisning;
    if (fellesAktiviteter) { //sjekk om det er noen fellesAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let fellesDiv = $("#course" + number + "felles");
      _createActivities(fellesAktiviteter,
        number,
        fellesDiv);
    }

    let gruppeAktiviteter = courses[number][0].activities.Gruppeundervisning;
    if (gruppeAktiviteter) { //sjekk om det er noen gruppeAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let gruppeDiv = $("#course" + number + "gruppe");
      _createActivities(gruppeAktiviteter,
        number,
        gruppeDiv);
    }

    //add click handler to button in added div
    $("#course" + number).on("click", "button#addLecture", function() {
      external(number);
    });
}

function _createActivities(activities, coursenum, div) {
  let activityNum = 0;

  activities.forEach(function(activity) {
    activityNum++;
    let checkboxId = div.prop("id") + "-a" + activityNum;
    let spanId = checkboxId + "-span";

    div.append(
      $('<span />')
        .attr("id", spanId)
        .append(
          $('<input />')
            .attr("type", "checkbox")
            .attr("id", checkboxId)
            .data("activities", activity)
        )
        .append(
          $('<label />')
          .attr("for", checkboxId)
          .text(activity.title + " - " + activity.timeRaw) //TODO: labels burde også ha med tid
        )
    );

    div.append($('<br>'));

    //fires when the checkbox is toggled
    div.on("click", "input#" + checkboxId, function() {
      //finn data som hører til html-elementet
      let clickedElement = $("#" + this.id);
      let eventData = clickedElement.data("activities");
      let courseName = clickedElement.parents(".courseContainer").data("courseId");

      if (this.checked) {
        calendar.addEvents(eventData, courseName, coursenum); //vis eventen i kalenderen
      } else {
        calendar.removeEvents(eventData); //fjern eventen fra kalenderen
      }
    });
  });
}
