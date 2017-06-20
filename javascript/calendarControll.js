var jquery = require('jquery');
var moment = require('moment');
var fullcalendar = require('fullcalendar');
var http = require('http');

//TODO: dette trenger masse reformattering

var myEvent = {
            title: 'My Event',
            start: '2014-06-11T10:15',
            end: '2014-06-11T12:00',
            allDay: false
            //description: 'This is a cool event'
        };

$(document).ready(function() {
  //TODO: formater kalenderen bedre
  $('#calendar').fullCalendar({
          // put your options and callbacks here
          defaultView: 'basicWeek', //TODO: bytte til timelineWeek? isåfall må du sjekke lisensgreier
          defaultDate: '2014-06-12',
          firstDay: 1, //første dag er mandag
          timeFormat: 'H(:mm)', //24-timersklokke
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

  $('#click').click(function() {
    getJSON();
  });
});

function getJSON() {
  http.get('/api/course', function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var response = JSON.parse(body);
        console.log("Got a response: ", response);
        _addEvtFromJSON(response);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

function _addEvtFromJSON(json) {
  var newEvent = {
    title: json.title,
    start: json.start,
    end: json.end
  };
  $('#calendar').fullCalendar('renderEvent', newEvent, false);
}
