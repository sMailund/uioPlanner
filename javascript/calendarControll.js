/*jshint esversion: 6 */

const moment = require('moment');
const fullcalendar = require('fullcalendar');
const jquery = require('jquery');

const colors = ["#00FFFF",
                "#FF8000",
                "#FFFF00",
                "#80FF00",
                "#00FF00"];

$(document).ready(function() {
  //TODO: formater kalenderen bedre
  $('#calendar').fullCalendar({
          // put your options and callbacks here
          defaultView: 'basicWeek', //TODO: bytte til timelineWeek? isåfall må du sjekke lisensgreier
          defaultDate: '2017-05-01',
          firstDay: 1, //første dag er mandag
          height: "parent",
          header: "", //fjern alle defaultgreier fra kalenderen
          timeFormat: 'H(:mm)', //24-timersklokke
          weekends: false,
  });
});

exports.addEvents = function(eventJSON, courseName, courseNum) {
  let events = _createEventsObject(eventJSON, courseName, courseNum);
  $('#calendar').fullCalendar('renderEvents', events);
};

exports.removeEvents = function(eventJSON) {
  let eventId = _createId(eventJSON);
  $('#calendar').fullCalendar('removeEvents', eventId);
};

exports.addHover = function(eventJSON, courseName) {
  let events = _createEventsObject(eventJSON, courseName, 0);
  events.map(event => {
    event.id = 'hover';
    event.color = "#b5b5b5"; //color event in grey
  });
  $('#calendar').fullCalendar('renderEvents', events);
};

exports.removeHover = function() {
  $('#calendar').fullCalendar('removeEvents', 'hover');
};

function _createEventsObject(json, courseName, courseNum) {
  let events = [];

  json.timeISO.forEach(function(time) {
    let event = {
      id: _createId(json),
      title: courseName + " - " + json.title, //det burde også stå hvilket emne det gjelder
      start: time.start,
      end: time.end,
      color: colors[courseNum]
    };
    events.push(event);
  });

  return events;
}

//TODO: id burde heller være noe mer unikt, her kan det kommer kollisjoner
function _createId(json) {
  return json.title;
}
