'use strict'
// dependency: recorder.js, lyrics.js

var lyric_spchreg = {}
var _recorder = null;
var audio_context;

lyric_spchreg.start = function start(params) {
    initRecorder();
    cycleRecording();
}

lyric_spchreg.end = function end(params) {

}

function cycleRecording(){
    
    startRecording();
    
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
    _recorder && _recorder.record();
}

function stopRecording() {
    _recorder && _recorder.stop();
    _recorder.clear();
}