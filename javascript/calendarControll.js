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
          defaultDate: '2017-05-01',
          firstDay: 1, //første dag er mandag
          timeFormat: 'H(:mm)', //24-timersklokke
          events: [
    				{
    					title: 'All Day Event',
    					start: '2017-05-01'
    				},
    				{
    					title: 'Long Event',
    					start: '2017-05-02',
    					end: '2017-05-03'
    				}
          ]
  });

  $('#click').click(function() {
    getJSON();
  });
});
//TODO: burde denne byttes ut med $.ajax?
function getJSON() {
  http.get('/api/course', function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var response = JSON.parse(body);
        console.log("Got a response: ", response);
        _parseActivitesJSON(response);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

//TODO: gjør dette mer elegant
function _parseActivitesJSON(json) {
  console.log(json);
  json.Fellesundervisning[0].time.forEach(function(event) {
    var eventJSON = {
      title: json.Fellesundervisning[0].title,
      start: event.start,
      end: event.end
    };
    _addEvtFromJSON(eventJSON);
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
