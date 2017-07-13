/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const connection = require('./dbConnect.js');

router.get('/', function(req, res, next) {
  connection.db.query("SELECT course_id, course_name FROM courses")
  .then(function(result) {
    res.json(result);
  }).catch(function(error) {
    console.log("error: " + error);
  });
});

module.exports = router;
