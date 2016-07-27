'use strict'

var lyric_progressIndictor = $({});

(function () {
    var initialled = false;
    var progressBar = $('<div class = "record-progress"></div>');

    init();

    PubSub.subscribe('lyric.itemUpdated', function (msg, data) {
        var item = data[0];
        if (item.length > 0) {
            //blinkCurItem(parseInt(item.attr('lrc_seq')));
            // showModeProgressBlk(item, parseFloat(item.attr('lrc_s')), parseFloat(item.attr('lrc_e')));
        }
    });

    function init() {
        if (initialled) return;

        $('body').append(progressBar);
        initialled = true;
    }

    function blinkCurItem(seq) {
        var blinkTimes = 5;
        var item = $('div[lrc_seq="' + (seq++) + '"]');
        console.log(item.text());
        var defaultCr = item.css('border-color');
        blinkSub(blinkTimes);

        function blinkSub(t) {
            if (t > 0) {
                item.css('border-color', t % 2 == 0 ? 'rgba(255,0,0,0.2)' : 'transparent');
                setTimeout(blinkSub.bind(null, t - 1), 400);
            }
            else {
                item.css('border-color', defaultCr);
            }
        }
    }

    function showModeProgressBlk(target, s, e) {
        var ts = 'pgs' + new Date().getTime();
        var div0 = $('<div class="clear" style="clear:both;">');
        var div1 = $('<div class="progress-wrapper" id="' + ts + '">');
        var div2 = $('<div class="progress-mask">');
        var h = target.height();
        var w = target.width();
        var orginContent = target.html();
        div1.html(orginContent);
        div1.append(div2);
        target.html('');
        target.append(div0);
        target.append(div1);
        target.append(div0);

        // div1.css('position', 'relative');
        // div1.css('overflow', 'visible');
        div1.css('float', 'left');
        // div2.css('right', '0px');
        // div2.css('top', '0px');
        div2.css('position', 'relative');
        div2.css('top', '-' + div1.height() + 'px');
        div2.css('width', '100%');
        div2.css('height', div1.height() + 'px');
        div2.css('background-color', 'rgba(255,0,0,0.2)');
        cycleReduceW(100);
        var reduceUnit = 100 / (e - s) / 1000 * 50;
        //setTimeout(, (e-s)*1000);
        var isStop = 0;
        function cycleReduceW(widthPer) {
            if (widthPer + reduceUnit < 0) {
                //target.html(orginContent);
                return;
            }
            else if (true) {
                div2.css('width', widthPer + '%');
                setTimeout(function () {
                    cycleReduceW(widthPer - reduceUnit);
                }, 50);
            }
        }
    }

})();
