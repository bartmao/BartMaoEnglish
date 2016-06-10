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

    var seq = parseInt(ad.currentTime);

    var nextLycItem = $('[lyc_s="' + seq + '"]');
    if (nextLycItem.length != 0
        && parseInt(nextLycItem.attr('lyc_e')) > ad.currentTime) {
        $('.lyric_cur').removeClass('lyric_cur');
        nextLycItem.addClass('lyric_cur');

        $('.lrc-container')[0].scrollTop = nextLycItem.position().top - $('.lyric-item').first().position().top - $('.lrc-wrapper-bg').height() / 2 + nextLycItem.height();
        console.log('top:' + $('.lrc-container')[0].scrollTop);
    }
});


$('.progress').click(function (e) {
    ad.currentTime = e.offsetX / $(this).width() * duration;
    console.log(e.offsetX / $(this).width() * duration);
});


loadLyric('lyrics/Friends.S01E01.srt', function (lyricObj) {
    var items = lyricObj.items;
    var lyricContent = '';
    for (var i = 0; i < items.length; i++) {
        lyricContent += '<div class = "lyric-item" lyc_s = "'
            + items[i].startTime
            + '" lyc_e = "'
            + items[i].endTime
            + '" lyc_seq = "'
            + items[i].seq
            + '" >'
            + items[i].lyricTxt.join('<br/>') + '</div>';
    }

    $('.lrc-container').html(lyricContent);
    
    $('.lyric-item')
    .mouseover(function () {
        $(this).addClass('lyric-hover');
    })
    .mouseout(function () {
        $(this).removeClass('lyric-hover');
    });
});