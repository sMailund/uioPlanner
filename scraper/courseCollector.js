/*jshint esversion: 6 */

const courseFinder = require("./courseFinder.js");
const courseScraper = require("./courseScraper.js");
const fs = require("fs");
const db = require("./database/dbControll.js");

const semester = "h17";
const entry = "http://www.uio.no/studier/emner/matnat/ifi/" +
"?filter.level=bachelor&filter.semester=" + semester;

const baseOutput = "./scraper/logs/";
const resultFileName = baseOutput + "results.txt";
const errorFileName = baseOutput + "errors.txt";

let date = new Date();

function scrape() {


  console.log("Init...");
  db.init();
  date = new Date();
  fs.appendFileSync(resultFileName, "\nScraping results " + date.toISOString() + "\n");
  fs.appendFileSync(errorFileName, "\nScraping results " + date.toISOString() + "\n");

  console.log("Finding links...");

  courseFinder.getCourseLinks(entry)
  .then(function(courses) {
    return Promise.all(
      courses.map(function(course) {
        let obj = course;
        obj.link = obj.link.concat(semester + "/timeplan/index.html");
        return obj;
      })
    );
  })
  .then(function(links) {
    console.log("Done. Found " + links.length + " links.");
    console.log("Scraping...");
    _iterateWithDelay(links);
  });
}

//gå gjennom alle linkene på siden med litt forsinkelse mellom hver forbindelse
//for å passe på at scriptet ikke sprenger nettforbindelsen hvis noe går galt
function _iterateWithDelay(courses) {

  console.log(courses.length + " remaining...");
  let course = courses.pop();

  let split = course.title.split(" - ");
  let code = split[0];
  let title = split[1];
  console.log("Scraping " + course.link);

  courseScraper.scrape(course.link)
  .then(function(result) {
    fs.appendFileSync(resultFileName, JSON.stringify(result, null, 3) + "\n");
    db.addNewCourse(code, title, result);
  })
  .catch(function(error) {
    fs.appendFileSync(errorFileName, "Could not scrape: " + course.link + "\n");
  });

  if (courses.length > 0) {
    setTimeout(function() {
      _iterateWithDelay(courses);
    }, 5000);
  } else {
    console.log("Done.");
  }
}

scrape();
