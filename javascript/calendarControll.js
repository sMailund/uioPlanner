var jquery = require('jquery');
var moment = require('moment');
var fullcalendar = require('fullcalendar');

$(document).ready(function() {
  //TODO: formater kalenderen bedre
  $('#calendar').fullCalendar({
          // put your options and callbacks here
          defaultView: 'basicWeek', //TODO: bytte til timelineWeek? isåfall må du sjekke lisensgreier
          defaultDate: '2017-05-01',
          firstDay: 1, //første dag er mandag
          timeFormat: 'H(:mm)', //24-timersklokke
  });
});

