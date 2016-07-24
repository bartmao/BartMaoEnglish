'use strict'

var lyric_dict = function(host, ctrl){
    this.host = host;
    this.ctrl = ctrl;

    this.host.on('lyric.onTextSelected', function(s, e){
        console.log(e);
    });
}