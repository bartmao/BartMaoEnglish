'use strict'
var uuid = require('node-uuid');
var fs = require('fs-extra');

var myfile = {};
myfile.savetempfile = function (stream, cb) {
  var fp = __dirname + '\\..\\public\\audios\\cache\\' + uuid.v1() + '.txt';
  var fstream = fs.createWriteStream(fp);
  stream.pipe(fstream);
  fstream.on('close', function () {
    console.log('done saving temp file...');
    cb && cb();
  });
}

myfile.readConfig = function (key, subkey) {
  var cfg = fs.readJsonSync('./config.json', { throws: false });
  if (cfg && key) {
    if (subkey && cfg[key] != undefined) return cfg[key][subkey];
    return cfg[key];
  }
}

module.exports = myfile;