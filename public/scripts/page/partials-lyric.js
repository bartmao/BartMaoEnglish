(function () {
    var host = $('[lyric]').makeLyric();
    var ctrl = new lyric_controller(host);
    var dict = new lyric_dict(host);

    host.on('lyric.manualModeChanged', function (t, isManual) {
        if (isManual) {
            $('[lyric_man]').addClass('lrc-controller-on');
            $('[lyric_auto]').removeClass('lrc-controller-on');
        }
        else {
            $('[lyric_auto]').addClass('lrc-controller-on');
            $('[lyric_man]').removeClass('lrc-controller-on');
        }
    });

    $('[lyric_auto]').click(function () { ctrl.setManual(0) });
    $('[lyric_man]').click(function () { ctrl.setManual(1) });
    $('[lyric_del_trans_tip]').click(function () { $('.lyric-popover').remove(); });

    PubSub.subscribe('player.timeUpdated', function (msg, data) {
        ctrl.update(data[0]);
    });

    var socket;
    var sessionId;
    $('[lyric_record]').click(function () {
        if (!socket) {
            socket = io('http://localhost:3000');
            sessionId = $('#sessionId').val();
        }

        var isOn = $(this).is('.lrc-controller-on');
        if (!isOn) {
            $(this).addClass('lrc-controller-on');
            socket.emit('MyRecorder', { typ: 'started', sid: sessionId });

            myrecorder.on('myrecorder.gotBuffer', function (t, sampleData) {
                var arr = Array.prototype.slice.call(sampleData);
                socket.emit('MyRecorder', { typ: 'sampleGot', sample: arr, sid: sessionId });
            });
            PubSub.publish('lyric.recordingStarted');
            myrecorder.start();
        }
        else {
            $(this).removeClass('lrc-controller-on');
            myrecorder.stop();
            socket.emit('MyRecorder', { typ: 'stopped', sid: sessionId });
            PubSub.publish('lyric.recordingStopped');
        }
    });

})();