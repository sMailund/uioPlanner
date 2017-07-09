/*jshint esversion: 6 */

const courseFinder = require("./courseFinder.js");
const courseScraper = require("./courseScraper.js");
const db = require("./database/dbControll.js");
const fs = require("fs");

const semester = "h17";
const entry = "http://www.uio.no/studier/emner/matnat/ifi/" +
"?filter.semester=" + semester;

const baseOutput = "./scraper/logs/";
//const resultFileName = baseOutput + "results.txt";
const errorFileName = baseOutput + "errors.txt";

let date;

function scrape() {

  console.log("Init...");
  db.init(); //backup og rensk gammel database
  date = new Date();
  //fs.appendFileSync(resultFileName, "\nScraping results " + date.toISOString() + "\n");
  fs.appendFileSync(errorFileName, "\nScraping results " + date.toISOString() + "\n");

  console.log("Finding links...");

  courseFinder.getCourseLinks(entry) //hent alle linkene fra ønsket side
  .then(function(courses) {
    return Promise.all(
      //gjør om alle linkene til å slutte på linken til timeplanen
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
    //rekursivt hent alle tidene og legg dem over i databasen med en liten forsinkelse
    //for å ikke tette opp nettverksforbindelsen
    _iterateWithDelay(links);
  });
}

//gå gjennom alle linkene på siden med litt forsinkelse mellom hver forbindelse
//for å passe på at scriptet ikke sprenger nettforbindelsen hvis noe går galt
function _iterateWithDelay(courses) {

  console.log(courses.length + " remaining...");
  let course = courses.pop(); //ta neste kurs som skal skrapes ut av listen

  //del kurskode og kursnavn, gjør det mer strukturert i databasen
  let split = course.title.split(" - ");
  let code = split[0];
  let title = split[1];

  console.log("Scraping " + course.link);

  //hent kurstidene fra siden
  courseScraper.scrape(course.link)
  .then(function(result) { //og sett kurset inn i databasen hvis det gikk bra
    //fs.appendFileSync(resultFileName, JSON.stringify(result, null, 3) + "\n");
    db.addNewCourse(code, title, result);
  })
  .catch(function(error) { //legg kurset i feilloggen hvis noe gikk galt
    fs.appendFileSync(errorFileName, "Could not scrape: " + course.link +
      " - reason: " + error + "\n");
  });

  //hvis det er flere linker igjen, vent 5 sekunder og begynn å skrape neste link
  if (courses.length > 0) {
    setTimeout(function() {
      _iterateWithDelay(courses);
    }, 5000);
  } else {
    //rekursjonsbunn
    console.log("Done.");
  }
}

scrape();
