"use strict"

var recorder = {};
var recorder_r;

recorder.start = function () {
    var sourceBlob = [];
    var options = { mimeType: 'audio/mp3' };

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
        audio: false,
        video: true
    };

    navigator.getUserMedia(constraints, successCallback, errorCallback);

    function successCallback(stream) {
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;
        if (window.URL) {
            gumVideo.src = window.URL.createObjectURL(stream);
        } else {
            gumVideo.src = stream;
        }
    }

    function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', e0);
        try {
            options = { mimeType: 'audio/mp3' };
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e1) {
            console.log('Unable to create MediaRecorder with options Object: ', e1);
            try {
                options = 'audio/mp3'; // Chrome 47
                mediaRecorder = new MediaRecorder(window.stream, options);
            } catch (e2) {
                alert('MediaRecorder is not supported by this browser.\n\n' +
                    'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
            }
        }
    }
    recorder_r.ondataavailable(handle_data);
    recorder_r.onstop(handle_stop);

    recorder_r.start(10);
    function handle_data(e) {
        if (e && e.data.size > 0) {
            sourceBlob.push(e.data);
        }
    }

    function handle_stop() {
        alert(sourceBlob.length);
    }
}

recorder.stop = function () {
    recorder_r.stop();
}

