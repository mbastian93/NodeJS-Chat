var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var chat = require('./routes/chat');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http) ;

var namespaces = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/NoPanic.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

io.on('connection', function (socket) {
    socket.on('newUser', function(evt) {
        var evtObject = JSON.parse(evt);
        socket.join(evtObject.room);
        io.to(evtObject.room).emit('newUser', evt);
    });
    socket.on('msg', function(evt) {
        var evtObject = JSON.parse(evt);
        io.to(evtObject.room).emit('msg', evt);
    });

    socket.on('kill', function(evt) {
        var evtObject = JSON.parse(evt);
        io.to(evtObject.room).emit('kill', evt);
    });
    socket.emit('connected');
});


module.exports.app = app;
module.exports.http = http;
