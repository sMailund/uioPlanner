/*jshint esversion: 6 */

const webdriver = require('selenium-webdriver');

//phantomjs must be installed for this to work properly
const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

exports.scrape = function(adress) {
  return new Promise(function(resolve, reject) {
    _getActivities(adress)
    .then(function(result) {
      if (typeof result == 'undefined') {
        reject("Scraper returned undefined");
      } else if (Object.keys(result).length === 0) {
        reject("Scraper returned empty JSON");
      } else {
        resolve(result);
      }
    })
    .catch(function(error) {
      reject(error);
    });
  });
};

//returns JSON object with all activities in selected course
function _getActivities(adress) {
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
        reject("Scraper failed to find correct div, most likely 404");
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
    );
    return json;
  });
}

//parses the text of the activities and creates key-value pairs with
//acitivty name and time
function _parseActivityText(activityArray) {
  return activityArray.map(function(text) {
    let innerjson = {};
    let splitted = text.split(" - ");
    innerjson.title = splitted[0];
    innerjson.timeRaw = splitted[1];
    innerjson.timeISO = _parseTime(splitted[1]);
    return innerjson;
  });
}

function _parseTime(inputText) {

  //match multiple course times seperated with " and ", ", " and " og " ;)
  let days = inputText.split(/ og |, | and /g);

  return days.map(function(day) {
    let when = {};

    let timeText = day.split(" ");
    let hoursTextSplitted = timeText[1].split("-");

    when.start = _createISO8601(timeText[0], hoursTextSplitted[0]);
    when.end = _createISO8601(timeText[0], hoursTextSplitted[1]);
    return when;
  });
}

//creates an ISO8601 string that the calendar-module uses to create events.
//because we only care about rendering a single week and the calendar needs
//a specific date to render, may 1st 2017 is used as the standard first day of the week
//and later days of the week is counted from the monday
function _createISO8601(day, hours) {
  let dayNum; //weekday expressed in number

  //find dayNum from the input string
  switch(day) {
    case 'ma':
    case 'Mon':
      dayNum = 1;
      break;
    case 'ti':
    case 'Tue':
      dayNum = 2;
      break;
    case 'on':
    case 'Wed':
      dayNum = 3;
      break;
    case 'to':
    case 'Thu':
      dayNum = 4;
      break;
    case 'fr':
    case 'Fri':
      dayNum = 5;
      break;
    default:
      throw "invalid date in _createISO8601: " + day;
    }

    //create and return the date-string
    return '2017-05-0' + dayNum + 'T' + hours;
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
exports.scrape("http://www.uio.no/studier/emner/matnat/its/UNIK4800/h17/timeplan/index.html")
.then(result => console.log(JSON.stringify(result, null, 3))) //success
.catch(error => console.log("Error: " + error)); //failure
*/
//TODO: fiks alle emnene som ikke kan skrapes
