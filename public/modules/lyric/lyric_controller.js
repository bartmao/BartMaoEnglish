'use strict'

var lyric_controller = function(host){
    this.host = host;
    this.isManual = 0; // 0,1
    this.curItem = $([]);

    this.update = function (timestamp) {
        var newItem = findCur(timestamp);
        if(this.curItem.attr('lrc_seq') != newItem.attr('lrc_seq')){
            this.curItem = newItem;
            if(!this.isManual)
                this.jumpToCur();
            PubSub.publish('lyric.itemUpdated', [newItem]);
        }
    }

    this.jumpToCur = function(){
        if(this.curItem.length > 0){
            var lyricContainerMid = this.host.height()/2;
            this.host[0].scrollTop += this.curItem.position().top - lyricContainerMid;
        }
    }

    this.setManual = function(isManual){
        if(this.isManual == isManual) return;
        this.isManual = isManual;
        PubSub.publish('lyric.manualModeChanged', [this.isManual]);
    }
    
    this.getManual = function(){
        return this.isManual;
    }

    function findCur(ts) {
        var cur = host.find('.lrc-cur');
        if (cur) {
            if (parseFloat(cur.attr('lrc_s')) <= ts && parseFloat(cur.attr('lrc_e')) > ts)
                return cur;
            else
                cur.removeClass('lrc-cur');
        }

        $.each(host.find('.lrc-item'), function (i, e) {
            var item = $(e);
            if (parseFloat(item.attr('lrc_s')) <= ts && parseFloat(item.attr('lrc_e')) > ts){
                item.addClass('lrc-cur');
                cur = item;
                return false;
            }
        });

        return cur;
    }
};