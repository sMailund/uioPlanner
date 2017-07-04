/*jshint esversion: 6 */

const courseFinder = require("./courseFinder.js");
const courseScraper = require("./courseScraper.js");
const fs = require("fs");

const semester = "h17";
const entry = "http://www.uio.no/studier/emner/matnat/ifi/" +
"?filter.levl=bachelor&filter.semester=" + semester;

let date = new Date();

function scrape() {

  console.log("Init...");
  date = new Date();
  fs.appendFileSync("./errors.txt", "\nScraping results " + date.toISOString());
  fs.appendFileSync("./results.txt", "\nScraping results " + date.toISOString());

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
    fs.appendFileSync("./results.txt", JSON.stringify(result, null, 3));
  })
  .catch(function(error) {
    fs.appendFileSync("./errors.txt", "Could not scrape: " + link);
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
