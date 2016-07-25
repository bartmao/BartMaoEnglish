'use strict'

module.exports = myaudioassembler;

function myaudioassembler(data) {
    console.log(data.sample.length + '   ' + new Date().toTimeString());
    if (!data.sid || !data.typ || !data.sample || !data.ts) return;
    this.data = data;
}

myaudioassembler.prototype.handle = function () {
    //console.log('handle');
}