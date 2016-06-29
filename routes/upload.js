var express = require('express');
var fs = require('fs-extra');
var uuid = require('node-uuid');

var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var fp = __dirname + '\\..\\public\\audios\\cache\\' + uuid.v1() + '.wav';
    fstream = fs.createWriteStream(fp);
    file.pipe(fstream);
    fstream.on('close', function () {
      //console.log('uploaded...' + filename);
      //res.render('done');
    });
  });
});


module.exports = router;
