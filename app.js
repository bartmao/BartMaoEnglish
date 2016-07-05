var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var expressSession = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(expressSession);

var myfile = require('./modules/myfile');

var routes = require('./routes/index');
var videos = require('./routes/video');
var users = require('./routes/users');
var tests = require('./routes/test');
var testapi = require('./routes/testapi');
var upload = require('./routes/upload');
var myfile = require('./modules/myfile');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

// set up redis session
var redisClient = redis.createClient(8889, myfile.readConfig('serverName'),{auth_pass: '', tls: {servername: 'bartmao.redis.cache.windows.net'}});
redisClient.on('error', function(err) {
     console.log('Redis error: ' + err);
}); 
app.use(expressSession({ store: new RedisStore({ client: redisClient }), secret: myfile.readConfig('session', 'secret'), resave: true, saveUninitialized: false }));

app.use('/', testapi);
app.use('/audios', routes);
app.use('/users', users);
app.use('/test', tests);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
