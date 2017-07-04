/*jshint esversion: 6 */

const webdriver = require('selenium-webdriver');

//phantomjs must be installed for this to work properly
const driver = new webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

//henter alle linkene til emner fra en enkelt side
//TODO: gjør at den kan hente fra alle sidene hvis listen er delt over flere sider
exports.getCourseLinks = function(entryURL) {
  return driver.get(entryURL)
  .then(function(page) {
    //finn alle emne-elementene
    return driver.findElements(webdriver.By.xpath("//tr/td/a"));
  })
  .then(function(courseElements) {
    //hent linkene til emnesidene
    return Promise.all(courseElements.map((course) => course.getAttribute("href")));
  })
  .then(function(courseLinks) {
    //trimm av ...idex.html på slutten av linken så den er lettere å jobbe med senere
    return (courseLinks.map(link => link.replace("index.html", "")));
  });
};
