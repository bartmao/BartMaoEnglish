"use strict"

var lyricExport = {};

var lyricObj = { url: null, pos: 0, items: [], plainTxt: null, isManual: false };
var lyricStateObj = { seq: 0, timeframe: null, lyricTxt: [], startTime: null, endTime: null, expectedIndex: 0 };

lyricExport.loadLyric = function loadLyric(url, cb) {
    lyricObj.url = url;

    $.get(url, function (txt) {
        lyricObj.plainTxt = txt;
        while (readLine(lyricHandler));
        cb(lyricObj);
    });
}

lyricExport.loadLyricWithDomsReturn = function loadLyricWithDomsReturn(url, cb) {
    lyricExport.loadLyric(url, function (lyricObj) {
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

        $('Body')
            .on('mouseover', '.lrc-item', function () {
                $(this).addClass('lrc-hover');
            })
            .on('mouseout', '.lrc-item', function () {
                $(this).removeClass('lrc-hover');
            });
        cb(lyricContent);
    });
}

lyricExport.findCurLyricItem = function findCurLyricItem() {
    var s = ad.currentTime;
    var p = null;

    $.each($('.lrc-item'), function (i, v) {
        if (parseFloat($(v).attr('lrc_s')) >= s) return false;
        else p = $(v);
    });

    if (p && parseFloat(p.attr('lrc_e')) > s)
        return [p, true];
    return [p, false];
}

lyricExport.isManualPlay = function isManualPlay(mode) {
    if (mode != undefined && mode != null) lyricObj.isManual = mode;
    return lyricObj.isManual;
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