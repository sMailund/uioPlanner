/*jshint esversion: 6 */

const webdriver = require('selenium-webdriver');

//phantomjs must be installed for this to work properly
const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

//blar gjennom alle sidene med kurs fra gitt url og returnerer linke til alle kursene
exports.getCourseLinks = function(entryURL) {
  url = _nextPageURL(entryURL);

  return driver.get(url)
  .then(function(page) {
    //finn alle emne-elementene
    return driver.findElements(webdriver.By.xpath("//tr/td/a"));
  })
  .then(function(courseElements) {
    //hent linkene til emnesidene med titler til linkene
    return Promise.all(
      [Promise.all(courseElements.map(course => course.getText())),
      Promise.all(courseElements.map(course => course.getAttribute("href")))]
    );
  })
  .then(function(courseTable) {

    //rekursjonsbunn
    if (courseTable[0].length === 0) {
      return [];
    }

    //lag array med JSON bestående av tittel og link for hvert emne
    let courses = courseTable[0].map(function(courseTitle, index) {
      let obj = {};
      obj.title = courseTitle;
      obj.link = courseTable[1][index].replace("index.html", "");
      return obj;
    });

    //rekursivt hent resultatene fra resten av sidene og legg dem til resultatet
    return exports.getCourseLinks(url)
    .then(recursiveCourses => recursiveCourses.concat(courses));
  });
};

function _nextPageURL(url) {
  let pageQuery = url.match(/page=\d+/);
  if (pageQuery == null) {
    if (url.includes("?")) {
      return url.concat("&page=1");
    } else {
      return url.concat("?page=1");
    }
  } else {
    let page = pageQuery[0].match(/\d+/);
    let nextPageQuery = pageQuery[0].replace(page, Number(page) + 1);
    return url.replace(pageQuery, nextPageQuery);
  }
}
/*
exports.getCourseLinks("http://www.uio.no/studier/emner/matnat/")
.then(result => console.log(result))
.catch(error => console.log(error));
*/
