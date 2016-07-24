var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index1', {title:'friends s01e01', lyricSrc:'lyrics/Friends.S01E01.srt'});
});

module.exports = router;
