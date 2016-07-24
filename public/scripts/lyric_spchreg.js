'use strict'
// dependency: myrecorder.js, lyrics.js

var lyric_spchreg = $({
});

(function () {
    var initialled = false;
    var audio_context;
    var workingProgress = 0;
    var minPostInterval = 2;

    var progressBar = $('<div class = "record-progress"></div>');

    var curSeq = 0;
    lyric_spchreg.start = function start(params) {
        initRecorder();
        startRecording();
        // blinkCurItem(seq);
        lyricExport.on('itemUpdated.lyric', function (t, s, e, seq) {
            if (curSeq != seq) {
                curSeq = seq;
                blinkCurItem(seq);
                showModeProgressBlk(seq, s, e);
            }
        });
    }

    lyric_spchreg.end = function end(params) {

    }

    function initRecorder() {
        if (initialled) return;

        $('body').append(progressBar);
        initialled = true;
    }

    function startRecording() {
        console.log('start recording:' + new Date());
        myrecorder.start();
    }

    function stopRecording() {
        console.log('stop recording' + new Date());
        myrecorder.stop();
        //uploader.uploadBlob(myrecorder.getWAVBlob());
    }

    function blinkCurItem(seq) {
        var blinkTimes = 5;
        var item = $('div[lrc_seq="' + seq + '"]');
        var defaultCr = item.css('border-color');
        blinkSub(blinkTimes);

        function blinkSub(t) {
            if (t > 0) {
                item.css('border-color', t % 2 == 0 ? 'rgba(255,0,0,0.2)' : 'transparent');
                setTimeout(blinkSub.bind(null, t - 1), 400);
            }
            else {
                item.css('border-color', defaultCr);
            }
        }
    }

    function showModeProgressBlk(seq, s, e) {
        var item = $('.lrc-cur');
        if(!item) return;
        
        var pos = item.offset();
        var height = item.height();
        var width = item.width();
        
        var divContent = $('<div class = "record-progress-content"></div>');
        //divContent.html(item.html());
        //item.text('');
        progressBar.append(divContent);
        progressBar.css('top', pos.top + 'px');
        progressBar.css('left', pos.left + 'px');
        progressBar.css('height', height + 'px');
        progressBar.css('width', width + 'px');

        //divWrapper.animate({ width: "0px" }, (e - s) * 1000);
        //setTimeout((function(d){d.remove();})(div), (e - s) * 1000);

    }

})();
