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

    $('[lyric_record]').click(function () {
        var isOn = $(this).is('.lrc-controller-on');
        if (!isOn) {
            $(this).addClass('lrc-controller-on');

            var socket = io('http://localhost:3000');
            myrecorder.on('myrecorder.gotBuffer', function (t, sampleData) {
                var arr = Array.prototype.slice.call(sampleData);
                socket.emit('newAudioSampleGen', { sample: arr });
            });
            myrecorder.start();
        }
        else {
            $(this).removeClass('lrc-controller-on');
            myrecorder.stop();
        }
        // socket.on('news', function (data) {
        //     console.log(data);

        // });
    });

})();