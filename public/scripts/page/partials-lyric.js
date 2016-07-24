(function () {
    var host = $('[lyric]').makeLyric();
    var ctrl = new lyric_controller(host);

    host.on('scroll', function () {
        console.log('scroll');
    });

    host.on('lyric.manualModeChanged', function(isManual){
        if(isManual){
            $([lyric_manual_on]).addClass('lrc-controller-on');
            $([lyric_manual_off]).remove('lrc-controller-on');
        }
        else{
            $([lyric_manual_off]).addClass('lrc-controller-on');
            $([lyric_manual_on]).remove('lrc-controller-on');
        }
    });
})();