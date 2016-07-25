'use strict'

var lyric_progressIndictor = $({});

(function () {
    var initialled = false;
    var progressBar = $('<div class = "record-progress"></div>');

    init();

    PubSub.subscribe('lyric.recordingStarted', function () {
        if ($('.lrc-cur')){
            blinkCurItem(++parseInt($('.lrc-cur').attr('lrc_seq')));

        }
    });



    // lyric_progressIndictor.start = function start(params) {
    //     init();
    //     startRecording();
    //     lyricExport.on('itemUpdated.lyric', function (t, s, e, seq) {
    //         if (curSeq != seq) {
    //             curSeq = seq;
    //             blinkCurItem(seq);
    //             showModeProgressBlk(seq, s, e);
    //         }
    //     });
    // }

    // lyric_progressIndictor.end = function end(params) {

    // }

    function init() {
        if (initialled) return;

        $('body').append(progressBar);
        initialled = true;
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
        if (!item) return;

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
