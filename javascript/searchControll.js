/*jshint esversion: 6 */

const http = require('http');
const courseRenderer = require("./coursesControll.js");

let courseList = ""; //create placeholder variable for courselist
_getCourseList(); //load courselist from api

//TODO: flytt over til egen modul
//fetch course list from api and add it to courseList
function _getCourseList() {
  let url = '/api/courseList';
  http.get(url, function(res){
    let body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    return res.on('end', function(){
      courseList = JSON.parse(body);
    });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });
}

//render clickable list of suggestions,
//is fired for evey character entered in the search box
function renderSuggestions() {
  let searchBox = $("#courseSearchBox"); //the search box
  let search = searchBox.val(); //search query entered in the search box
  let results = $("#results"); //div to display elements in
  let maxResults = 10; //maximum number of results displayed, rest is truncated

  results.empty(); //remove previously displayed results

  //if the search box isn't empty
  if(search) {
    let numberOfResults = 0; //number of results found so far
    courseList.forEach(function(course) {
      courseString = course.course_id + " - " + course.course_name; //create name string

      //look for index of first match, will be -1 if no match is found
      let firstOccurence = courseString.toLowerCase().indexOf(search.toLowerCase());
      if (firstOccurence !== -1) {
        numberOfResults++;
        //only render results untill maximum is reached
        if (numberOfResults <= maxResults) {
          //highlight match without losing case
          courseString = courseString.substring(0, firstOccurence) + "<b>" +
          courseString.substring(firstOccurence, firstOccurence + search.length) + "</b>" +
          courseString.substring(firstOccurence + search.length, courseString.length);

          let id = "result" + numberOfResults; //id of element to be added

          //render result
          results.append(
            $("<div />")
            .html(courseString)
            .addClass("suggestionBox")
            .attr("id", id)
            .data("courseId", course.course_id) //add couse id to data
          );

          //add event listener to added element
          $('div#' + id).on('click', function() {
            //render the course assosiated with clicked element
            let clickedElement = $("#" + this.id);
            courseRenderer.renderCourse(clickedElement.data("courseId"));

            //remove search suggestions and text in search box
            results.empty();
            searchBox.val("");
          });
        }
      }
    });

    //list truncated results
    if (numberOfResults > maxResults) {
      results.append(
            $("<div />")
            .html("...and " + (numberOfResults - maxResults) + " more")
            .addClass("suggestionBox")
            .attr("id", "truncated")
      );
    }
  }
}

module.exports = {
  renderSuggestions
};
