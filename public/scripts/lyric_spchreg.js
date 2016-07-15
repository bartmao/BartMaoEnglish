'use strict'
// dependency: myrecorder.js, lyrics.js

var lyric_spchreg = $({
});

(function () {
    var initialled = false;
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
        if (initialled) return;
    }

    function startRecording() {
        console.log('start recording:'+ new Date());
        myrecorder.start();
    }

    function stopRecording() {
        console.log('stop recording'+ new Date());
        myrecorder.stop();
        uploader.uploadBlob(myrecorder.getWAVBlob());
    }
})();
