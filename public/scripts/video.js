"use strict"

var video = $('video')[0];
video.playbackRate = 4;
video.addEventListener('ended', function(e){
    video.src = "http://localhost:3000/videos/Friends.S01E02.webm";
    video.play();
},false)