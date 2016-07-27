'use strict'
var fs = require('fs-extra');
var uuid = require('node-uuid');

module.exports = myaudioassembler;

var cache = [[]];
var totalLen = 0;
var channelNum = 1;
var sampleRate = 16000;

function myaudioassembler(data) {
    console.log(data.typ + '   ' + new Date().toTimeString());
    //if (!data.sid || !data.typ || !data.sample || !data.ts) return;
    cache[0] = (data.sample);
    totalLen += data.sample.length;
    totalLen = data.sample.length ;
    if (data.typ == 'recordStopped') {
        var typedArr = getWAVBlob(cache, totalLen).buffer;
        console.log(typedArr.byteLength);
        var blob = [].slice.call(typedArr);
        console.log(blob);
        console.log(blob.length);
        var fp = __dirname + '\\..\\public\\audios\\cache\\' + uuid.v1() + '.wav';
        var fstream = fs.createWriteStream(fp);
        fstream.write(blob);
        fstream.end();
    }
}

myaudioassembler.prototype.handle = function () {
    //console.log('handle');
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

function floatTo16BitPCM(view, offset, input) {
    for (var i = 0; i < input.length; i++ , offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}