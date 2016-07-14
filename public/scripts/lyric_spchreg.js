'use strict'
// dependency: myrecorder.js, lyrics.js

var lyric_spchreg = $({
});

(function () {
    var _recorder = null;
    var audio_context;
    var workingProgress = 0;
    var minPostInterval = 2;

    lyric_spchreg.start = function start(params) {
        initRecorder();
        lyricExport.on('itemUpdated.lyric', function (t, s, e, seq) {
            if (!workingProgress) {
                workingProgress = 1;
                startRecording();
                setTimeout(function () { workingProgress = 2 }, minPostInterval * 1000);
            }
            else {
                setTimeout(function () {
                    if (workingProgress == 2) {
                        stopRecording();
                        workingProgress = 0;
                    }
                }, (e - s) * 1000);
            }
        });
    }

    lyric_spchreg.end = function end(params) {

    }

    function initRecorder() {
        if (_recorder) return;

        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            audio_context = new AudioContext;
        } catch (e) {
            console.error('No web audio support in this browser!');
        }

        navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
            console.error('No live audio input: ' + e);
        });

    }

    function startUserMedia(stream) {
        var input = audio_context.createMediaStreamSource(stream);
        _recorder = new Recorder(input, { numChannels: 1 });
    }

    function startRecording() {
        console.log('start recording:'+ new Date());
        _recorder && _recorder.record();
    }

    function stopRecording() {
        console.log('stop recording'+ new Date());
        _recorder && _recorder.stop();
        _recorder.exportWAV(function (blob) {
            uploader.uploadBlob(blob);
        });
        _recorder.clear();
    }
})();
