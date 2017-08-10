/*jshint esversion: 6 */

const moment = require('moment');
const fullcalendar = require('fullcalendar');
const jquery = require('jquery');

const colors = ["#09632d",
                "#1c3144",
                "#461220",
                "#2f2d2e",
                "#c33c54",
                "#940094",
                "#7d4500"];

$(document).ready(function() {
  $('#calendar').fullCalendar({
          defaultView: 'month',
          defaultDate: '2017-08-21',
          allDaySlot: false, //fjern seksjon for heldagseventer
          firstDay: 1, //første dag er mandag
          minTime: '08:00:00', //tidligste time er kl 8
          maxTime: '19:00:00', //og vis helt ned til kl 1 9
          slotLabelFormat: 'H:mm', //24-timersklokke
          height: 'parent',
          header: {
            left: 'agendaDay,agendaWeek,month',
            center: 'title',
            right: 'today prev,next'
          },
          weekends: false,
          views: {
            month: {
              columnFormat: 'ddd'
            },
            agendaWeek: {
              columnFormat: 'ddd M/D'
            },
            agendaDay: {
              columnFormat: 'dddd M/D'
            }
          }
  });
});

exports.addEvents = function(eventJSON, courseName, courseNum) {
  let events = _createEventsObject(eventJSON, courseName, courseNum);
  $('#calendar').fullCalendar('renderEvents', events, true);
};

exports.removeEvents = function(eventJSON, courseName, courseNum) {
  let eventId = _createId(eventJSON, courseName, courseNum);
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

exports.removeActivity = function(eventNumber) {
  //see if the event starts with
  //the eventnumber that is being deleted
  $('#calendar').fullCalendar('removeEvents',
    event => event.id.indexOf(eventNumber) === 0);
};

function _createEventsObject(json, courseName, courseNum) {
  let events = [];

  json.sessions.forEach(function(time) {
    let event = {
      id: _createId(json, courseName, courseNum),
      title: courseName + " - " + time.title,
      start: time.startISO,
      end: time.endISO,
      color: colors[courseNum],
    };
    events.push(event);
  });

  return events;
}

function _createId(json, courseName, courseNum) {
  return courseNum + courseName + json.title;
}
