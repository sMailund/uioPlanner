var express = require('express');
var router = express.Router();

//test data
//TODO: apien burde heller sende ting i dette formatet,
//enn sånn det kommer fra scraper
var output = {
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
  res.json(output);
});

module.exports = router;
