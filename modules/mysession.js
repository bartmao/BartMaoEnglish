'use strict'

var expressSession = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(expressSession);

var myfile = require('./myfile');
var myglobals = require('./myglobals');

var mysession = {}

mysession.initSession = function initSession() {
    if (myfile.readConfig('env') != 'dev') {
        // set up redis session
        var redisClient = redis.createClient(8890, myfile.readConfig('redis', 'serverName'), { auth_pass: myfile.readConfig('redis', 'key') });
        redisClient.on('error', function (err) {
            console.log('Redis error: ' + err);
        });
        redisClient.on('ready', function () {
            console.log('Redis is ready');
            myglobals.redis = redisClient;
        });

        return expressSession({ store: new RedisStore({ client: redisClient }), secret: myfile.readConfig('session', 'secret'), resave: true, saveUninitialized: false });
    }
    else {
        return expressSession({ secret: myfile.readConfig('session', 'secret'), resave: true, saveUninitialized: false });
    }

}

module.exports = mysession;