'use strict'
var fs = require('fs');
var myfile = require('./myfile');

module.exports = myaudioassembler;

var cache = [];
var totalLen = 0;
var channelNum = 1;
var sampleRate = 16000;

function myaudioassembler(data) {
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
        var ws = blk.ws;
        ws.on('finish', function () {
            fs.open(blk.fname, 'r+', function (err, fd) {
                var buf = new Buffer(4);
                buf.writeUInt32LE(blk.totalSampleLength + 36, 0);
                fs.write(fd, buf);
                fs.close(fd);

                cache.pop();
            });
        });
        ws.end();

        //readBinaryAndGetWAV();
    }
    else if (data.typ == 'sampleGot') {
       	var blk = findBlk(sid);
        var ws = blk.ws;
        blk.totalSampleLength += data.sample.length;
        floatTo16BitPCM(data.sample);
        var buf = Buffer.from(data.sample);
        ws.write(buf);
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

function getWriteableStream(blk) {
    var fname = ('./public/audios/cache/' + blk.sid + '.wav');
    blk.fname = fname;
    var ws = fs.createWriteStream(fname);
    blk.ws = ws;
    return ws;
}

function writeWAVStreamHeader(ws) {
    var buf = new Buffer(44);
    /* RIFF identifier */
    buf.write('RIFF', 0);
    /* RIFF chunk length */
    buf.writeUInt32LE(0, 4);
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
    buf.writeUInt32LE(sampleRate * 2, 40);

    ws.write(buf);
}

function getWAVBlob(buf, totalLen) {
    var oneBuf = new Float32Array(totalLen);
    var offset = 0;
    for (var i = 0; i < buf.length; ++i) {
        oneBuf.set(buf[i], offset);
        offset += buf[i].length;
    }

    return encodeWAV(oneBuf);
}

function encodeWAV(samples) {
    var arr = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(arr);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, channelNum, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, channelNum * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);
    return view;
}

function floatTo16BitPCM(buf) {
    for (var i = 0; i < buf.length; i++) {
        var s = Math.max(-1, Math.min(1, buf[i]));
        buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
}

function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}