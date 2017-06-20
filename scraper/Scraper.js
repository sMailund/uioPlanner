/*jshint esversion: 6 */

const webdriver = require('selenium-webdriver');

//phantomjs must be installed for this to work properly
const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

//returns JSON object with all activities in selected course
function getActivities(adress) {
  return _getActivitiesWebElement(adress) //get the activity div
  .then(function(activityBox) {
    //find titles and actities on page
    var titles = activityBox.findElements(
      webdriver.By.className('cs-toc-title'));
    var activities = activityBox.findElements(
      webdriver.By.className('cs-toc-content'));
    return Promise.all([titles, activities]);
  })
  .then(function(values) {
    //values[0] -> titles
    //values[1] -> the activities for each title
    //create and return a json-element with the activities
    return _createJSON(values);
  });
}

//connects to a webpage and returns the div containing all the activities
function _getActivitiesWebElement(adress) {
  return driver.get(adress)
  .then(function() {
    //find the activity-div
    return driver.findElements(webdriver.By.id('activities'));
  })
  .then(function(result) {
    return new Promise(function(resolve, reject){
      //there should be exactly one div found
      if (result.length == 1) {
        resolve(result[0]);
      } else {
        //if else, something is wrong.
        //errors can be caught and dealt with on the receiving end
        reject();
      }
    });
  });
}



//creates a json object from the activities found on the page,
//structured the same way as on the webpage
function _createJSON(pageContent) {
  let headings = _getActivitiesHeadings(pageContent[0]);
  let content = _getActivitiesText(pageContent[1]);

  return Promise.all([headings, content])
  .then(function(elements) {
    let json = {};
    //add the elements to the json file
    elements[0].forEach(
      (heading, index) => json[heading] = _parseActivityText(elements[1][index])
    ); //fortsett her
    return json;
  });
}

//parses the text of the activities and creates key-value pairs with
//acitivty name and time
function _parseActivityText(activityArray) {
  return activityArray.map(function(text) {
    let innerjson = {};
    let splitted = text.split(" - ");
    innerjson[splitted[0]] = _parseTime(splitted[1]);
    return innerjson;
  });
}

function _parseTime(inputText) {

  let days = inputText.split(" og ");
  //console.log(days)
  return days.map(function(day) {
    let when = {};
    let hours = {};
    let timeText = day.split(" ");
    let hoursTextSplitted = timeText[1].split("-");

    hours.start = hoursTextSplitted[0];
    hours.end = hoursTextSplitted[1];

    when.day = timeText[0];
    when.hours = hours;
    return when;
  });
}

function _getActivitiesHeadings(elements) {
  return Promise.all(elements)
  .then(function (elements) {
    return Promise.all(elements.map(element => element.getText()));
  });
}

function _getActivitiesText(elements) {
  return Promise.all(elements) //wait until content is ready for scraping
  .then(function(elements) {
    //for each of the sections, find all activities contained in the section
    let activities = elements.map(function(element) {
      return element.findElements(webdriver.By.className("cs-toc-section-link"));
    });
    return Promise.all(activities);
  })
  .then(function(elements) {
    //for each of the sections,
    //find and return the text contained in the activity field
    return Promise.all(elements.map(function(subarray) {
      return Promise.all(subarray.map(element => element.getText()));
    }));
  });
}
/*
getActivities("http://www.uio.no/studier/emner/matnat/ifi/INF1010/v17/timeplan/index.html")
.then(result => console.log(JSON.stringify(result, null, 3))) //success
.catch(() => console.log("Error getting activities")); //failure
*/
