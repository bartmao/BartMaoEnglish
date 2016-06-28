var uploader = {};

uploader.uploadBlob = function(data){
    var form = new FormData();
    form.append('blob', data);
    
    var req = new XMLHttpRequest();
    req.open('POST', 'Upload');
    req.send(form);
}