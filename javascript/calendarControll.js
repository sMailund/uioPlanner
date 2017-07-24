/*jshint esversion: 6 */

//TODO: fiks feil hvor flere events kan fjernes samtidig

const moment = require('moment');
const fullcalendar = require('fullcalendar');
const jquery = require('jquery');

const colors = ["#09632d",
                "#1c3144",
                "#461220",
                "#2f2d2e",
                "#c33c54"];

$(document).ready(function() {
  //TODO: formater kalenderen bedre
  $('#calendar').fullCalendar({
          defaultView: 'agendaWeek',
          defaultDate: '2017-05-01',
          allDaySlot: false, //fjern seksjon for heldagseventer
          firstDay: 1, //første dag er mandag
          columnFormat: 'dddd', //bare hvis ukedagsnavn, ikke dato
          minTime: '08:00:00', //tidligste time er kl 8
          maxTime: '19:00:00', //og vis helt ned til kl 1 9
          slotLabelFormat: 'H:mm', //24-timersklokke
          height: 'parent',
          header: '', //fjern alle defaultgreier fra kalenderen
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
