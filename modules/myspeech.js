'use strict'

var http = require('http');
var https = require('https');
var myglobals = require('./myglobals');
var myfile = require('./myfile');
var fs = require('fs');
var util = require('util');

var myspeech = {};

myspeech.startRecognition = function (voiceStream) {
    myglobals.redis.get('speech-timestamp', (e, s) => {
        if (new Date() - Date.parse(s) >= 1000 * 60 * 8)
            speechAuthenticate(postVoiceData);
        else postVoiceData();
    });
};

function speechAuthenticate(cb) {
    var key = myfile.readConfig('speech', 'key');
    var content = 'grant_type=client_credentials&client_id=' + key + '&client_secret=' + key + '&scope=https%3A%2F%2Fspeech.platform.bing.com';
    console.log(content);
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
        res.on('data', (chuck) => {
            var v = JSON.parse(chuck);
            myglobals.redis.set('speech_token', v['access_token']);
            myglobals.redis.set('speech-timestamp', new Date());

            console.log('access_token:' + v["access_token"]);
            console.log('timestamp:' + new Date());

            cb || cb();
        });

        // myfs.savetempfile(res, function () {
        //     clientRes.write(new Date().toUTCString());
        //     clientRes.end();
        // });
    });

    req.write(content);
    req.end();
}

function postVoiceData() {
    myglobals.redis.get('speech_token', (e, key) => {
        var stat = fs.statSync('./public/demo/audios/1.wav');

        var options = {
            hostname: 'speech.platform.bing.com',
            path: '/recognize?scenarios=ulm&appid=D4D52672-91D7-4C74-8AD8-42B1D98141A5&locale=en-US&device.os=windows&version=3.0&format=json&instanceid=9954a97b-1627-4690-bf5f-d927fcb8dee0&requestid=ada3af0b-903e-4bce-b5ac-80606c1c2f84',
            method: 'post',
            headers: {
                'Content-Type': 'audio/wav; samplerate=16000',
                'Authorization': 'Bearer ' + key,
                'Content-Length': stat.size
            }
        };

        var req = https.request(options, res => {
            console.log(res.statusCode);
            if (res.statusCode == 200)
                res.on('data', chunk => {
                    var r = JSON.parse(chunk);
                    console.log(r.header.lexical);
                });
        });

        var readable = fs.createReadStream('./public/demo/audios/1.wav');
        readable.pipe(req, { end: false });
        readable.on('end', e => {
            console.log('file send');
            req.end();
        });
    });
}

module.exports = myspeech;