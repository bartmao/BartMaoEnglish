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
});
$('.progress').click(function (e) {
    ad.currentTime = e.offsetX / $(this).width() * duration;
    console.log(e.offsetX / $(this).width() * duration);
});