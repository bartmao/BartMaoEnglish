"use strict"

var lyricExport = {};

var lyricObj = { url: null, pos: 0, items: [], plainTxt: null, isManual: false, curScriptBlk: null, curLycItem: null };
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

        $('body')
            .on('mouseover', '.lrc-item', function () {
                $(this).addClass('lrc-hover');
            })
            .on('mouseout', '.lrc-item', function () {
                $(this).removeClass('lrc-hover');
            })
            .on('mouseup', '.lrc-item', function (e) {
                var sel = getSelectionText().trim();

                if (sel) {
                    lyricObj.curScriptBlk = $('<script src="http://fanyi.youdao.com/openapi.do?keyfrom=MyEnglishLearning&key=932553150&type=data&doctype=jsonp&callback=parseSearch&version=1.1&q=' + sel + '" />');
                    lyricObj.curLycItem = $(this);
                    $('body').append(lyricObj.curScriptBlk);
                    console.log(sel);
                }
            });
        cb(lyricContent);
    });
}

lyricExport.findCurLyricItem = function findCurLyricItem(curTime) {
    var p = null;

    $.each($('.lrc-item'), function (i, v) {
        if (parseFloat($(v).attr('lrc_s')) >= curTime) return false;
        else p = $(v);
    });

    if (p && parseFloat(p.attr('lrc_e')) > curTime)
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

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function parseSearch(record) {
    var popover = $('#popover' + lyricObj.curLycItem.attr('lrc_seq'));
    if (popover.length == 0) {
        popover = $('<div id="popover' + lyricObj.curLycItem.attr('lrc_seq') + '" class="popover fade in top lyric-popover"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span><div class="arrow"></div><div class="popover-content"></div></div>');
        popover.insertBefore(lyricObj.curLycItem);
        $('.lyric-popover .glyphicon-remove').click(function () {
            popover.remove();
        });
    }
    var curContent = popover.find('.popover-content').html();
    var phonetic = record ? record.basic ? record.basic.phonetic : '' : '';
    phonetic = phonetic?'['+phonetic+']':'';
    if (curContent)
        popover.find('.popover-content').html(curContent + '<br/>' + record.query + phonetic + ':' + record.translation.join('/'));
    else
        popover.find('.popover-content').html(record.query + phonetic + ':' + record.translation.join('/'));

    lyricObj.curScriptBlk.remove();
}