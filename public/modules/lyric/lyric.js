(function ($) {
    'use strict'

    var host = null;
    var src = null;

    $.fn.makeLyric = function () {
        host = this;
        src = this.attr('lyc_src');
        loadLyricWithDomsReturn(src, function (lyricContent) {
            host.html(lyricContent);
            addInteractiveClass();
        });

        return host;
    }

    var lyricObj = { url: null, pos: 0, items: [], plainTxt: null, isManual: false, curScriptBlk: null, curLycItem: null };
    var lyricStateObj = { seq: 0, timeframe: null, lyricTxt: [], startTime: null, endTime: null, expectedIndex: 0 };

    function loadLyric(url, cb) {
        lyricObj.url = url;

        $.get(url, function (txt) {
            lyricObj.plainTxt = txt;
            while (readLine(lyricHandler));
            cb(lyricObj);
        });
    }

    function loadLyricWithDomsReturn(url, cb) {
        loadLyric(url, function (lyricObj) {
            var items = lyricObj.items;
            var lyricContent = '';
            for (var i = 0; i < items.length; i++) {
                lyricContent += '<div class = "lrc-item" lrc_s = "'
                    + items[i].startTime
                    + '" lrc_e = "'
                    + items[i].endTime
                    + '" lrc_seq = "'
                    + items[i].seq
                    + '" >'
                    + items[i].lyricTxt.join('<br/>') + '</div>';
            }

            cb(lyricContent);
        });
    }

    function addInteractiveClass(){
        $('.lrc-item').mouseover(function(){
            $(this).addClass('lrc-hover');
        })
        .mouseout(function(){
            $(this).removeClass('lrc-hover');
        })
        .mouseup(function (e) {
            var sel = getSelectionText().trim();
            if(sel)
                host.trigger('lyric.onTextSelected', [sel]);
        });
    }

    function readLine(cb) {
        var start = lyricObj.pos;
        var txt = lyricObj.plainTxt;
        while (start < lyricObj.plainTxt.length && !(txt[start] == '\r' && txt[start + 1] == '\n'))
            start++;
        if (start <= txt.length) {
            cb(txt.substr(lyricObj.pos, start - lyricObj.pos + 1));
            lyricObj.pos = start + 2;
            return true;
        }

        return false;
    }

    function lyricHandler(line) {
        var trimedLine = line.trim();

        if (trimedLine == '') {
            lyricObj.items.push({ seq: lyricStateObj.seq, timeframe: lyricStateObj.timeframe, lyricTxt: lyricStateObj.lyricTxt, startTime: lyricStateObj.startTime, endTime: lyricStateObj.endTime });
            lyricStateObj.lyricTxt = [];
            lyricStateObj.expectedIndex = 0;
        }

        if (lyricStateObj.expectedIndex == 0) {
            var seq = parseInt(line.trim());
            if (!Number.isNaN(seq)) {
                lyricStateObj.seq = seq;
                lyricStateObj.expectedIndex++;
            }
        }
        else if (lyricStateObj.expectedIndex == 1) {
            lyricStateObj.timeframe = line;
            var timeframes = line.split('-->');
            var hms = timeframes[0].split(':');
            var ms = timeframes[0].split(',')[1];
            lyricStateObj.startTime = parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2]) + parseFloat(ms[1] / 1000);
            hms = timeframes[1].split(':');
            ms = timeframes[1].split(',')[1];
            lyricStateObj.endTime = parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2]) + parseFloat(ms[1] / 1000);
            lyricStateObj.expectedIndex++;
        }
        else {
            lyricStateObj.lyricTxt.push(line);
        }
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }
})(jQuery);
