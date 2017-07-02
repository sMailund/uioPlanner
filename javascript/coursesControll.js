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
        console.log(courses);
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
            .data(activity)
        )
        .append(
          $('<label />')
          .attr("for", checkboxId)
          .text(activity.title) //TODO: labels burde også ha med tid
        )
    );

    console.log($("#" + checkboxId).data());

    div.append($('<br>'));

    //fires when the checkbox is toggled
    div.on("click", "input#" + checkboxId, function() {
      if (this.checked) {
        //get data assosiated with element and render event
        _createEventObject(($("#" + this.id).data()));
      } else {
        //TODO: slett kalender event her
        console.log("unchecked");
      }
      //console.log($("#" + this.id).data());
    });
  });
}

function _createEventObject(json) {
  let events = [];

  json.time.forEach(function(time) {
    let event = {
      title: json.title,
      start: time.start,
      end: time.end
    };
    events.push(event);
  });

  calendar.addEvents(events);
}

//adding click event to dynamically added elements
/*
//add click handler to button in added div
$("#courses").on("click", "button#addedbutton" + 1, function() {
  external();
});

function external(number) {
  console.log(courses[number][0].activities);
}
*/