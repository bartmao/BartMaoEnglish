var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('test');
});

router.get('/Recording', function(req, res, next) {
  res.render('test/Recording');
});

module.exports = router;
