/* jshint esversion: 6 */

const connection = require("./dbConnect.js");

//kalles før skrapingen begynner
const init = function() {
  connection.db.query("CREATE TABLE scraping ( " +
  "activities jsonb, " +
  "course_id text NOT NULL, " +
  "course_name text" +
  " )");
};

//flytter courses til backup og flytter scraping til courses
const backupAndMove = function() {
  return connection.db.query("SELECT * INTO $1~ FROM courses", _createBackupName()) //flytt alt over i backup
  .then(function() {
    return connection.db.query("DELETE FROM courses"); //tøm tabellen
  })
  .then (function() {
    return connection.db.query("INSERT INTO courses SELECT * FROM scraping"); //flytt over alt fra scraping
  })
  .then(function() {
    return connection.db.query("DROP TABLE scraping"); //slett scraping
  });
};

function _createBackupName() {
  return "backup_" + new Date().toISOString();
}

const addNewCourse = function(courseId, courseName, activitiesJSON) {
  return connection.db.query("INSERT INTO scraping (course_id, course_name, activities) "+
            "VALUES ($1, $2, $3)",
            [courseId, courseName, JSON.stringify(activitiesJSON)]);
};

module.exports = {
  init,
  backupAndMove,
  addNewCourse
};
