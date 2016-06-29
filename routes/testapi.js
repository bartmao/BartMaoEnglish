var express = require('express');
var router = express.Router();
var http = require('http');

var myfs = require('../modules/myfile.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  postSpeechSrv(res);
});

function postSpeechSrv(clientRes) {
  var content = 'grant_type=client_credentials&client_id=<Your subscription key>&client_secret=<Your subscription key>&scope=https%3A%2F%2Fspeech.platform.bing.com';
  
  var options = {
    hostname: 'oxford-speech.cloudapp.net',
    path: '/token/issueToken',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': content.length
    }
  };
  var req = http.request(options, res => {
    myfs.savetempfile(res, function () {
      clientRes.write(new Date().toUTCString());
      clientRes.end();
    });
  });

  req.write(content);
  req.end();
}

module.exports = router;
