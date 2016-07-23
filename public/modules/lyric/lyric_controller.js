'use strict'

var lyric_controller = $({});

(function () {
    var status = 'stop'; // run,stop
    var isManual = 0; // 0,1
    var curItem = null;
    var nextItem = null;

    lyric_controller.update = function (timestamp) {
        var newItem = findCur(timestamp);
        if(!($('.lrc-cur').length == 0 && newItem.length == 0) && ($('.lrc-cur') != newItem)){
            $('[lryic]').trigger('lyric.itemUpdated', [newItem]);
            curItem = newItem;
            scrollToPos(newItem);
        }
    }

    lyric_controller.jumpToCur = function(){
        if(curItem.length > 0){
            curItem.
        }
    }

    function findCur(ts) {
        var cur = $('.lrc-cur');
        if (cur) {
            if (parseFloat(cur.attr('lrc_s')) <= ts && parseFloat(cur.attr('lrc_e')) > ts)
                return cur;
            else
                cur.removeClass('lrc-cur');
        }

        $.each($('.lrc-item'), function (i, e) {
            var item = $(e);
            if (parseFloat(item.attr('lrc_s')) <= ts && parseFloat(item.attr('lrc_e')) > ts){
                item.addClass('lrc-cur');
                cur = item;
                return false;
            }
        });

        return cur;
    }

    function scrollToPos(newItem){
        var lyricContainerMid = $('.lrc-container').offset().top + $('.lrc-container').height()/2;
        var curOffset = newItem.offset().top - lyricContainerMid;
        if(curOffset > 0){
            console.log(curOffset);
            $('.lrc-container')[0].scrollTop += curOffset;
        }
    }
})();