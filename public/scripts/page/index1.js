var indexState = { curLyc: 1 };

function formatTime(seconds) {
    var mins = parseInt(seconds / 60);
    var minstr = mins < 10 ? '0' + mins : mins;
    var secs = parseInt(seconds % 60);
    var secstr = secs < 10 ? '0' + secs : secs;
    return minstr + ":" + secstr;
}

var ad = new Audio("audios/Friends.S01E01.mp3");
var duration = 29 * 60 + 40;
$('body').on('click', '.glyphicon-play', function () {
    ad.play();
    $('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');;
});
$('body').on('click', '.glyphicon-pause', function () {
    ad.pause();
    $('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');;
});
$(ad).on('timeupdate', function () {
    $('.progress-bar').css('width', ad.currentTime / duration * 100 + '%');
    $('#curTime').text(formatTime(ad.currentTime));

    var rst = lyricExport.updateCur(ad.currentTime);
    if (!rst) return;

    var curItem = rst[0];
    if (rst[1]) {
        var mode = lyricExport.isManualPlay();
        if (!mode)
            $('.lrc-container')[0].scrollTop = curItem.position().top
                - $('.lrc-item').first().position().top
                - $('.lrc-wrapper-bg').height() / 2 + curItem.height();
    }
});

$('.progress').click(function (e) {
    ad.currentTime = e.offsetX / $(this).width() * duration;
    console.log(e.offsetX / $(this).width() * duration);
});

// lyricExport.loadLyricWithDomsReturn('lyrics/Friends.S01E01.srt', function (lyricContent) {
//     $('.lrc-container').html(lyricContent);
//     $('.lrc-item').click(function (e) {
//         if (e.pageX - $(this).offset().left <= 20) // lyric-item left border
//             ad.currentTime = parseFloat($(this).attr('lrc_s'));
//     });
// });

$('.lrc-playmode .glyphicon').click(function () {
    var cur = $('.lrc-controller-cur');
    var className = $(this).attr('class');
    if (className.indexOf('lrc-controller-cur') != -1) return;
    else {
        if (className.indexOf('glyphicon-magnet') != -1) lyricExport.isManualPlay(false);
        else lyricExport.isManualPlay(true);

        cur.removeClass('lrc-controller-cur');
        $(this).addClass('lrc-controller-cur');
    }
});

$('.lrc-controller .glyphicon-trash').click(function () {
    $('.popover').remove();
})

$('.glyphicon-record').click(function () { lyric_spchreg.start() });