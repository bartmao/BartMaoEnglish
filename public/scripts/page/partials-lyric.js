(function () {
    var host = $('[lyric]').makeLyric();
    var ctrl = new lyric_controller(host);
    var dict = new lyric_dict(host);

    host.on('scroll', function () {
        console.log('scroll');
    });

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
})();