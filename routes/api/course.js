/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const connection = require('./dbConnect.js');

router.get('/', function(req, res, next) {
  console.log(req.query.code);
  connection.db.query("SELECT * FROM courses WHERE course_id = \'$1#\'", [req.query.code])
  .then(function(result) {
    res.json(result);
  }).catch(function(error) {
    console.log("error: " + error);
  });
});

module.exports = router;
