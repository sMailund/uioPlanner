/*jshint esversion: 6 */

const courseFinder = require("./courseFinder.js");
const courseScraper = require("./courseScraper.js");
const fs = require("fs");

const semester = "h17";
const entry = "http://www.uio.no/studier/emner/matnat/ifi/" +
"?filter.level=bachelor&filter.semester=" + semester;

const baseOutput = "./scraper/logs/";
const resultFileName = baseOutput + "results.txt";
const errorFileName = baseOutput + "errors.txt";

let date = new Date();

function scrape() {

  console.log("Init...");
  date = new Date();
  fs.appendFileSync(resultFileName, "\nScraping results " + date.toISOString() + "\n");
  fs.appendFileSync(errorFileName, "\nScraping results " + date.toISOString() + "\n");

  console.log("Finding links...");

  courseFinder.getCourseLinks(entry)
  .then(function(links) {
    return Promise.all(links.map(link =>
      link.concat(semester + "/timeplan/index.html")));
  })
  .then(function(links) {
    console.log("Done. Found " + links.length + " links.");
    console.log("Scraping...");
    _iterateWithDelay(links);
  });
}

//gå gjennom alle linkene på siden med litt forsinkelse mellom hver forbindelse
//for å passe på at scriptet ikke sprenger nettforbindelsen hvis noe går galt
function _iterateWithDelay(linkArray) {

  console.log(linkArray.length + " remaining...");
  let link = linkArray.pop();
  console.log("Scraping " + link);

  courseScraper.scrape(link)
  .then(function(result) {
    fs.appendFileSync(resultFileName, JSON.stringify(result, null, 3) + "\n");
  })
  .catch(function(error) {
    fs.appendFileSync(errorFileName, "Could not scrape: " + link + "\n");
  });

  if (linkArray.length > 0) {
    setTimeout(function() {
      _iterateWithDelay(linkArray);
    }, 5000);
  } else {
    console.log("Done.");
  }
}

scrape();
