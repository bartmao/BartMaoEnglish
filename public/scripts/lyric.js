var lyricObj = { url: null, pos: 0, items: [], plainTxt: null };
var stateObj = { seq: 0, timeframe: null, lyricTxt: [], startTime: null, endTime: null, expectedIndex: 0 };

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
        lyricObj.items.push({ seq: stateObj.seq, timeframe: stateObj.timeframe, lyricTxt: stateObj.lyricTxt, startTime: stateObj.startTime, endTime: stateObj.endTime });
        stateObj.lyricTxt = [];
        stateObj.expectedIndex = 0;
    }

    if (stateObj.expectedIndex == 0) {
        var seq = parseInt(line.trim());
        if (!Number.isNaN(seq)) {
            stateObj.seq = seq;
            stateObj.expectedIndex++;
        }
    }
    else if (stateObj.expectedIndex == 1) {
        stateObj.timeframe = line;
        var timeframes = line.split('-->');
        var hms = timeframes[0].split(':');
        stateObj.startTime = parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2]);
        hms = timeframes[1].split(':');
        stateObj.endTime = parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2]);
        stateObj.expectedIndex++;
    }
    else {
        stateObj.lyricTxt.push(line);
    }
}

function loadLyric(url, cb) {
    lyricObj = { url: url, pos: 0, items: [], plainTxt: null, seq: 0, };

    $.get(url, function (txt) {
        lyricObj.plainTxt = txt;
        while (readLine(lyricHandler));
        cb(lyricObj);
    });
}