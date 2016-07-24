(function () {
    var player = $('[player]');

    var ad = new Audio("audios/Friends.S01E01.mp3");
    var duration = 29 * 60 + 40;

    $('[player-play]').click(function () {
        if ($(this).is('.glyphicon-play')) {
            ad.play();
            $(this).removeClass('glyphicon-play').addClass('glyphicon-pause');
        }
        else {
            ad.pause();
            $(this).removeClass('glyphicon-pause').addClass('glyphicon-play');
        }

    });

    $(ad).on('timeupdate', function () {
        $('.progress-bar').css('width', ad.currentTime / duration * 100 + '%');
        $('#curTime').text(formatTime(ad.currentTime));
        player.trigger('player.timeUpdated', []);
        // var rst = lyricExport.updateCur(ad.currentTime);
        // if (!rst) return;

        // var curItem = rst[0];
        // if (rst[1]) {
        //     var mode = lyricExport.isManualPlay();
        //     if (!mode)
        //         $('.lrc-container')[0].scrollTop = curItem.position().top
        //             - $('.lrc-item').first().position().top
        //             - $('.lrc-wrapper-bg').height() / 2 + curItem.height();
        // }
    });

    $('.progress').click(function (e) {
        ad.currentTime = e.offsetX / $(this).width() * duration;
    });
})();