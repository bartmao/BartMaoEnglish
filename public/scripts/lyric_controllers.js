'use strict'

var lyric_controllers = $({});

(function () {
    var status = 'run'; // run,stop
    var isManual = 0; // 0,1
    var timeline = 0;
    var curItem = null;
    var nextItem = null;

    lyric_controllers.run = function () {
        status = 'run';
    }

    lyric_controllers.stop = function () {

    }

    function findCur() {
        var p = null;
        var pp = $('.lrc-cur');
        if (pp && parseFloat(pp.attr('lrc_s')) < curTime && parseFloat(pp.attr('lrc_e')) >= curTime)
            return [p, false];

        $('.lrc-cur').removeClass('lrc-cur');
        $.each($('.lrc-item'), function (i, v) {
            if (parseFloat($(v).attr('lrc_s')) >= curTime) return false;
            else p = $(v);
        });

        if (p && parseFloat(p.attr('lrc_e')) > curTime) {
            p.addClass('lrc-cur');
            console.log(p.attr('lrc_s'));
            lyricExport.trigger('itemUpdated.lyric'
                , [parseFloat(p.attr('lrc_s')),
                    parseFloat(p.attr('lrc_e')),
                    parseFloat(p.attr('lrc_seq'))]);
            return [p, true];
        }

        return [p, false];
    }
})();