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

    var socket = io('http://localhost:3000');

    $('[lyric_record]').click(function () {
        var isOn = $(this).is('.lrc-controller-on');
        if (!isOn) {
            $(this).addClass('lrc-controller-on');

            myrecorder.on('myrecorder.gotBuffer', function (t, sampleData) {
                var arr = Array.prototype.slice.call(sampleData);
                socket.emit('newAudioSampleGen', { sample: arr });
            });
            PubSub.publish('lyric.recordingStarted');
            myrecorder.start();
        }
        else {
            $(this).removeClass('lrc-controller-on');
            myrecorder.stop();
            socket.emit('newAudioSampleGen', { sample: [], typ: 'recordStopped'});
            PubSub.publish('lyric.recordingStopped');            
        }
    });

})();