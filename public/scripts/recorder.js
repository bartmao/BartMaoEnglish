"use strict"

var recorder = {};
var mediaRecorder;
var sourceBlob = [];

recorder.start = function () {
    var options = { mimeType: 'audio/webm' };

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
        audio: true,
        video: false
    };

    navigator.getUserMedia(constraints, successCallback, errorCallback);

    function successCallback(stream) {
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;

        mediaRecorder = new MediaRecorder(window.stream, options);
        mediaRecorder.ondataavailable = handle_data;
        mediaRecorder.onstop = handle_stop;
        mediaRecorder.start(10);

        function handle_data(e) {
            if (e && e.data.size > 0) {
                sourceBlob.push(e.data);
            }
        }

        function handle_stop() {
            alert(sourceBlob.length);
        }
    }

    function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
    }
}

recorder.stop = function () {
    mediaRecorder.stop();
}

recorder.download = function () {
    var blob = new Blob(sourceBlob, { type: 'audio/webm' });
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'audio.webm';
    a.target = 'blank';
    a.click();

    // setTimeout(function () {
    //     a.remove();
    //     window.URL.revokeObjectURL(url);
    // }, 2000);
}

