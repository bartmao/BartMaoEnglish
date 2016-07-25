(function () {
    var player = $('[player]');

    var ad = new Audio("audios/Friends.S01E01.mp3");
    var duration = 29 * 60 + 40;
    var speedArr = [0.6, 0.8, 1, 1.2, 1.4];

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

        PubSub.publish('player.timeUpdated', [ad.currentTime]);
    });

    $('[player-speed]').click(function () {
        var s = parseFloat($(this).text().substr(1));
        var newSpeed = speedArr[speedArr.indexOf(s) == speedArr.length - 1 ? 0 : speedArr.indexOf(s) + 1];
        $(this).text('x' + newSpeed);
        ad.playbackRate = newSpeed;
    });

    $('.progress').click(function (e) {
        ad.currentTime = e.offsetX / $(this).width() * duration;
    });

    function formatTime(seconds) {
        var mins = parseInt(seconds / 60);
        var minstr = mins < 10 ? '0' + mins : mins;
        var secs = parseInt(seconds % 60);
        var secstr = secs < 10 ? '0' + secs : secs;
        return minstr + ":" + secstr;
    }
})();