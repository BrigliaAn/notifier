var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config.global');
var ejsLayouts = require("express-ejs-layouts");
var notifications = require('./routes/notifications.js');
var index = require('./routes/index.js')
var socketio = require('socket.io');
var eventEmitter = require('events').EventEmitter;

var events= new eventEmitter.EventEmitter();
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views/'));
app.set('notificationsEvents',events);
app.locals.moment = require('moment');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri,function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
	} else {
		console.log ('Succees! Connected to: ' + config.mongo.uri);
	}
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(ejsLayouts);
app.use('/', index);
app.use('/notifications', notifications);
app.use(express.static(__dirname + '/public'));

app.use("*",function(req,res){
 	res.sendFile(__dirname + '/public/404.html');
});

var server = app.listen(process.env.PORT || config.port, function() {
    console.log('listening on ' + config.port)
});

var io = socketio.listen(server);

io.use(function(socket, next){
    if ( typeof socket.handshake.query.sede === "string") {
				socket.sede = socket.handshake.query.sede;
				return next();
    }
    // call next() with an Error if you need to reject the connection.
    next(new Error('Authentication error: No sede'));
});

io.on('connection', function(socket,username) {
    console.log('Client connected... SEDE: ' + socket.sede );

    events.on('latest-notification-changed',function(notification){
    	console.log("This is the lastest notification", JSON.stringify(notification) );
    	socket.emit('latest-notification-changed',notification);
    });
});
