/*jshint esversion: 6 */

//TODO: untangle the spaghetti
//TODO: comments

let jquery = require('jquery');
let http = require('http');
let calendar = require('./calendarControll.js');

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
        _createCourseBox(response, numberOfCourses++);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

function _createCourseBox(json, courseNum) {

  //create new div
  $("#courses").append(
    $('<div />')
    .attr("id", "course" + courseNum)
    .addClass("courseContainer")
    .data("courseId", json[0].course_id)
      .append(
        $("<h2 />")
        .text(json[0].course_id)
      )
      .append(
        $('<div />')
        .attr("id", "course" + courseNum + "felles")
        .append(
          $('<h3 />')
          .text("Fellesundervisning")
        )
      )
      .append(
        $('<div />')
        .attr("id", "course" + courseNum + "gruppe")
        .append(
          $('<h3 />')
          .text("Gruppeundervisning")
        )
      )
    );

    _parseActivities(courseNum, json);

    //add click handler to button in added div
    $("#course" + courseNum).on("click", "button#addLecture", function() {
      external(courseNum);
    });
}

function _parseActivities(courseNum, json) {
    let fellesAktiviteter = json[0].activities.Fellesundervisning;
    if (fellesAktiviteter) { //sjekk om det er noen fellesAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let fellesDiv = $("#course" + courseNum + "felles");
      _createActivities(fellesAktiviteter,
        courseNum,
        fellesDiv);
    }

    //hacky løsning på at noen kurs er på engelsk, kan forbedres, men funker
    let plenary = json[0].activities["Plenary sessions"];
    if (plenary) { //sjekk om det er noen fellesAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let fellesDiv = $("#course" + courseNum + "felles");
      fellesDiv.children("h3").text("Plenary Sessions");
      _createActivities(plenary,
        courseNum,
        fellesDiv);
    }

    let gruppeAktiviteter = json[0].activities.Gruppeundervisning;
    if (gruppeAktiviteter) { //sjekk om det er noen gruppeAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let gruppeDiv = $("#course" + courseNum + "gruppe");
      _createActivities(gruppeAktiviteter,
        courseNum,
        gruppeDiv);
    }

    let group = json[0].activities["Group sessions"];
    if (group) { //sjekk om det er noen gruppeAktiviteter å vise
      //og vis dem i riktig div hvis det er noen
      let gruppeDiv = $("#course" + courseNum + "gruppe");
      gruppeDiv.children("h3").text("Group Sessions");
      _createActivities(group,
        courseNum,
        gruppeDiv);
    }
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
