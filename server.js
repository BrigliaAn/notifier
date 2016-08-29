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
var Notification = require('./model/notification.js');

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
var clients = {};

io.use(function(socket, next){
    if ( typeof socket.handshake.query.sede === "string") {
				socket.sede = socket.handshake.query.sede;
				return next();
    }
    // call next() with an Error if you need to reject the connection.
    next(new Error('Authentication error: No sede'));
});

io.on('connection', function(socket) {
    console.log('Client connected... SEDE: ' + socket.sede );
    clients[socket.sede] = socket;
    Notification.getLatestNotificationBySede(socket.sede, function(err, notification){
        console.log("id sede", socket.sede);
        if(!err) {
            socket.emit('latest-notification-changed',notification);
        }
    });
    events.on('latest-notification-changed',function(notification){
        console.log("emitiendo latest nofii", notification);
        if(notification.office_id == 3){
            console.log("paratodas las sedes", notification);
            socket.emit('latest-notification-changed',notification);
        }
        if(notification.office_id == 1){
            console.log("para sede escobar");
            clients['1'].emit('latest-notification-changed',notification);
        }
        if(notification.office_id == 2){
            console.log("para sede derqui");
            clients['2'].emit('latest-notification-changed',notification);
        }
    });
    //events.on('latest-notification-changed',function(notification){
    //	socket.emit('latest-notification-changed',notification);
    //});
});
