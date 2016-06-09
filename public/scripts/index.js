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
    
    $('.lyric-item').each(function()
    {
        if(parseInt($(this).attr('lyc_s')) <= ad.currentTime
            && parseInt($(this).attr('lyc_e')) >= ad.currentTime)
            $(this).addClass('lyric_cur');
        else
            $(this).removeClass('lyric_cur');
            
    });
});
$('.progress').click(function (e) {
    ad.currentTime = e.offsetX / $(this).width() * duration;
    console.log(e.offsetX / $(this).width() * duration);
});

loadLyric('lyrics/Friends.S01E01.srt', function(lyricObj)
{
    var items = lyricObj.items;
    var lyricContent = '';
    for(var i = 0;i< items.length;i++)
    {
        lyricContent += '<div class = "lyric-item" lyc_s = "'
            + items[i].startTime
            + '" lyc_e = "'
            + items[i].endTime
            + '">'
            + items[i].lyricTxt.join('<br/>') + '</div>';
    }
    
    $('.lrc-container').html(lyricContent);
});