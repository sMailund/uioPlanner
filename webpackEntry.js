var jquery = require('jquery');
var moment = require('moment');
var fullcalendar = require('fullcalendar');

var myEvent = {
            title: 'My Event',
            start: '2010-01-01',
            description: 'This is a cool event'
        };

$(document).ready(function() {

  $('#calendar').fullCalendar({
          // put your options and callbacks here
          defaultView: 'basicWeek',
          defaultDate: '2014-06-12',
          events: [
    				{
    					title: 'All Day Event',
    					start: '2014-06-01'
    				},
    				{
    					title: 'Long Event',
    					start: '2014-06-07',
    					end: '2014-06-10'
    				}
          ]
  });



});
