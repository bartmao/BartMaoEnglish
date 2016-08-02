'use strict'
var fs = require('fs');
var myfile = require('./myfile');
var myspeech = require('./myspeech');

module.exports = myaudioassembler;

// Global obtained data.
var cache = [];
var totalLen = 0;
var channelNum = 1;
var sampleRate = 16000;

function myaudioassembler(data, socket) {
    if (!data.sid || !data.typ) return;

    console.log(data.typ + '   ' + new Date().toTimeString());
    //if (!data.sid || !data.typ || !data.sample || !data.ts) return;
    var sid = data.sid;
    if (data.typ == 'started') {
        var blk = { sid: sid, ws: null, fname: null, totalSampleLength: 0 };
        var ws = getWriteableStream(blk);
        writeWAVStreamHeader(ws);
        cache.push(blk);
    }
    else if (data.typ == 'stopped') {
       	var blk = findBlk(sid);
        refreshAndSendToCongSrv(blk, socket);
    }
    else if (data.typ == 'sampleGot') {
       	var blk = findBlk(sid);
        var ws = blk.ws;
        blk.totalSampleLength += data.sample.length;
        ws.write(floatTo16BitPCM(data.sample));
    }
    else if (data.typ == 'statementUpdated') {
        var blk = findBlk(sid);
        // 10sec * 256k / 16bit = 160000 samples 
        if (blk.totalSampleLength >= 160000) {
            refreshAndSendToCongSrv(blk, socket);
        }
    }
}

myaudioassembler.prototype.handle = function () {
    //console.log('handle');
}

function findBlk(sid) {
    for (var i = 0; i < cache.length; ++i) {
        if (cache[i].sid == sid)
            return cache[i];
    }
    return null;
}

// Get stream of current session, use Redis as temp stream stroage instead later.
function getWriteableStream(blk) {
    var fname = ('./public/audios/cache/' + blk.sid + '.wav');
    blk.fname = fname;
    var ws = fs.createWriteStream(fname);
    console.log('recording file created');
    blk.ws = ws;
    return ws;
}

function writeWAVStreamHeader(ws) {
    var buf = new Buffer(44);
    /* RIFF identifier */
    buf.write('RIFF', 0);
    /* RIFF chunk length */
    buf.writeUInt32LE(0, 4); //populate later
    /* RIFF type */
    buf.write('WAVE', 8);
    /* format chunk identifier */
    buf.write('fmt ', 12);
    /* format chunk length */
    buf.writeUInt32LE(16, 16);
    /* sample format (raw) */
    buf.writeUInt16LE(1, 20);
    /* channel count */
    buf.writeUInt16LE(channelNum, 22);
    /* sample rate */
    buf.writeUInt32LE(sampleRate, 24);
    /* byte rate (sample rate * block align) */
    buf.writeUInt32LE(sampleRate * 2, 28);
    /* block align (channel count * bytes per sample) */
    buf.writeUInt16LE(channelNum * 2, 32);
    /* bits per sample */
    buf.writeUInt16LE(16, 34);
    /* data chunk identifier */
    buf.write('data', 36);
    /* data chunk length */
    buf.writeUInt32LE(0, 40); // populate later

    ws.write(buf);
}

// Two samples occupies one byte
function floatTo16BitPCM(buf) {
    var newBuf = new Buffer(buf.length * 2);
    var offset = 0;

    for (var i = 0; i < buf.length; i++) {
        var s = Math.max(-1, Math.min(1, buf[i]));
        var augs = s < 0 ? s * 0x8000 : s * 0x7FFF;
        // uncheck overflow since it's conversion of float to int.
        newBuf.writeUInt16LE(augs, offset, true);
        offset += 2;
    }

    return newBuf;
}

// Refresh the audio stream, send them to Speech Recognition Service
function refreshAndSendToCongSrv(blk, socket) {
    var ws = blk.ws;
    ws.on('finish', function () {
        fs.open(blk.fname, 'r+', function (err, fd) {
            // Workaround--populate all length data after audio stream all delivered. 
            var readBuf = new Buffer(40);
            var buf = new Buffer(8);
            fs.read(fd, readBuf, 0, 4);
            buf.writeUInt32LE(blk.totalSampleLength * 2 + 36, 0); // wav file length
            buf.writeUInt32LE(blk.totalSampleLength * 2, 4); // wav data length
            fs.write(fd, buf, 0, 4);
            fs.read(fd, readBuf, 0, 32); // skip 32bit and jump to data chunk field
            fs.write(fd, buf, 4, 4);
            fs.close(fd);

            myspeech.startRecognition(fs.createReadStream(blk.fname), (status, lexical) => {
                //fs.unlink(blk.fname);
                socket.emit('MyRecorder.srv', { typ: 'statementParsed', status: status, lexical: lexical });
            });

            cache.pop();
        });
    });

    ws.end();
}