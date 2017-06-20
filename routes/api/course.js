var express = require('express');
var router = express.Router();

//test data
//TODO: apien burde heller sende ting i dette formatet,
//enn sånn det kommer fra scraper
var output = {
  title: "gruppe 1 MIT",
  day: 3,
  start: "2014-06-11T14:15", //TODO: hvordan dealer jeg med at jeg ikke er opptatt av eksakt dato?
  end: "2014-06-11T16:00"
};



router.get('/', function(req, res, next) {
  res.json(output);
});

module.exports = router;
