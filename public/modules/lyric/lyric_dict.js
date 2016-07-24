'use strict'

var lyric_dict = function (host) {
    this.host = host;
    this.cache = [];

    this.host.on('lyric.onTextSelected', function (s, t, e, ts) {
        search(t, e, ts);
    });

    function search(t, q, ts) {
        var url = "http://fanyi.youdao.com/openapi.do?keyfrom=MyEnglishLearning&key=932553150&type=data&doctype=jsonp&callback=parseSearch" + ts + "&version=1.1&q=" + q;
        var curScriptBlk = $('<script src="' + url + '" ts="' + ts + '"/>');
        window['parseSearch' + ts] = function (record) {
            parseSearch(record, t);
            delete window['parseSearch' + ts];
            $('script[ts="' + ts + '"]').remove();
        }
        $('body').append(curScriptBlk);
    }

    function parseSearch(record, t) {
        var popover = $('#popover' + t.attr('lrc_seq'));
        if (popover.length == 0) {
            popover = $('<div id="popover' + t.attr('lrc_seq') + '" class="popover fade in top lyric-popover"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><div class="arrow"></div><div class="popover-content"></div></div>');
            popover.insertBefore(t);
            $('.lyric-popover .glyphicon-remove').click(function () {
                popover.remove();
            });
        }
        var curContent = popover.find('.popover-content').html();
        var phonetic = record ? record.basic ? record.basic.phonetic : '' : '';
        phonetic = phonetic ? '[' + phonetic + ']' : '';
        if (curContent)
            popover.find('.popover-content').html(curContent + '<br/>' + record.query + phonetic + ':' + record.translation.join('/'));
        else
            popover.find('.popover-content').html(record.query + phonetic + ':' + record.translation.join('/'));
    }
}

