
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