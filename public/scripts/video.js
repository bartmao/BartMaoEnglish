"use strict"
<<<<<<< HEAD
=======

var video1 = $('#video1')[0];
var video2 = $('#video2')[0];
video1.load();
video2.load();
video1.play();
//video.playbackRate = 4;
video1.addEventListener('ended', function (e) {
    $('#video2').show();
    var video2 = $('#video2')[0];
    video2.play();
}, false);
>>>>>>> 8861ff36f7559c245a1f02f8a9f8ac9c5b7db92c
