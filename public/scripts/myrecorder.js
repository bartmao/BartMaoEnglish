
var myrecorder = $({});

(function () {
    'use strict'

    var initialled = false;

    var isRecording = false;
    var buf = [];
    var totalLen = 0;
    var channelNum = 1;
    var sampleRate = 16000;
    var defaultSampleRate = 0;// default sample rate: chrome/48000
    var ctx = null;

    myrecorder.start = function () {
        init();
        buf = [];
        totalLen = 0;
        isRecording = true;
        myrecorder.trigger('myrecorder.start');
    }

    myrecorder.stop = function () {
        isRecording = false;
        myrecorder.trigger('myrecorder.stop');
    }

    myrecorder.getWAVBlob = function (mybuf, myLen) {
        var thisBuf = mybuf ? mybuf : buf;
        var thisLen = myLen ? myLen : totalLen;

        var oneBuf = new Float32Array(totalLen);
        var offset = 0;
        for (var i = 0; i < thisBuf.length; ++i) {
            oneBuf.set(thisBuf[i], offset);
            offset += thisBuf[i].length;
        }

        var encodedBuf = encodeWAV(oneBuf);
        return new Blob([encodedBuf], { type: 'audio/wav' });
    }

    function init() {
        if (initialled) return;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        var cxt = new AudioContext();
        isRecording = true;

        navigator.getUserMedia({ audio: true }, function (stream) {
            var streamNode = cxt.createMediaStreamSource(stream);

            var processNode = (cxt.createScriptProcessor || cxt.createJavaScriptNode).call(cxt, 1024 * 4, channelNum, channelNum);
            processNode.onaudioprocess = function (e) {
                if (defaultSampleRate == 0) defaultSampleRate = e.inputBuffer.sampleRate;
                popluateBuf(e);
            };
            streamNode.connect(processNode);
            processNode.connect(cxt.destination);
        }, function () { });

        initialled = true;
    }

    function popluateBuf(e) {
        if (!isRecording) return;

        var f = e.inputBuffer;
        var cdata = f.getChannelData(channelNum - 1);

        for (var i = 0; i < cdata.length; ++i)
            if (cdata[i] != 0) break;
        if (i == cdata.length) return;

        var downsampledData = downSampleRate(defaultSampleRate, sampleRate, cdata);

        myrecorder.trigger('myrecorder.gotBuffer', [downsampledData]);

        buf.push(downsampledData);
        totalLen += downsampledData.length;
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

    function downSampleRate(orginSr, tarSr, buf) {
        if (orginSr == tarSr) return buf.slice();

        var ratio = orginSr / tarSr - (orginSr % tarSr) / tarSr;
        var newBuf = new Float32Array(buf.length / ratio - (buf.length % ratio) / ratio);
        var newBufOffset = 0;
        var bufOffset = 0;

        for (; newBufOffset < newBuf.length && bufOffset < buf.length; newBufOffset++ , bufOffset += ratio) {
            newBuf[newBufOffset] = buf[bufOffset];
        }

        return newBuf;
    }
})();