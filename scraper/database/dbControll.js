/* jshint esversion: 6 */

//TODO: flytt over i egen modul
const connection = require("./dbConnect.js");

//bør kalles når skraping skal begynne for å ta backup av tabellen
//og tømme den før oppdaterte kurs skal legges inn
const init = function() {
  connection.db.query("SELECT * INTO $1~ FROM courses", _createBackupName()) //flytt alt over i backup
  .then(function() {
    connection.db.query("DELETE FROM courses"); //tøm tabellen
  });
};

function _createBackupName() {
  return "backup_" + new Date().toISOString();
}

const addNewCourse = function(courseId, courseName, activitiesJSON) {
  return connection.db.query("INSERT INTO courses (course_id, course_name, activities) "+
            "VALUES ($1, $2, $3)",
            [courseId, courseName, JSON.stringify(activitiesJSON)]);
};

module.exports = {
  init,
  addNewCourse
};
