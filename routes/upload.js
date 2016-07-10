var express = require('express');
var fs = require('fs-extra');
var uuid = require('node-uuid');

var myspeech = require('../modules/myspeech');

var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    myspeech.startRecognition(file, r => { res.write(r); res.end(); });

    // var fp = __dirname + '\\..\\public\\audios\\cache\\' + uuid.v1() + '.wav';
    // fstream = fs.createWriteStream(fp);
    // file.pipe(fstream);
    // fstream.on('close', function () {
    //   //console.log('uploaded...' + filename);
    //   //res.render('done');
    // });
  });
});


module.exports = router;
