/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();

const db = pgp('postgres://test_user:pleaseIgnroe@localhost:5432/planner');


//test data
let output = {
  "Fellesundervisning": [
      {
         "title": "Forelesninger",
         "time": [
            {
               "start": "2017-05-03T14:15",
               "end": "2017-05-03T16:00"
            },
            {
               "start": "2017-05-04T10:15",
               "end": "2017-05-04T12:00"
            }
         ]
      }
   ]
};



router.get('/', function(req, res, next) {
  console.log(req.query.code);
  db.query("SELECT * FROM courses WHERE coursecode = \'$1#\'", [req.query.code])
  .then(function(result) {
    //console.log("got result: " + JSON.stringify(result));
    res.json(result);
  }).catch(function(error) {
    console.log("error: " + error);
  });
});

module.exports = router;
