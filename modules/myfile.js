'use strict'
var uuid = require('node-uuid');
var fs = require('fs-extra');

var myfile = {};
myfile.savetempfile = function(stream, cb){
    var fp = __dirname + '\\..\\public\\audios\\cache\\' + uuid.v1() + '.txt';
    var fstream = fs.createWriteStream(fp);
    stream.pipe(fstream);
    fstream.on('close', function () {
      console.log('done saving temp file...');
      cb && cb();
    });
}

myfile.readSubKey = function(key){
    fs.readJson('', (err, obj)=>{
      return obj.SubKey;
    });
}

module.exports = myfile;