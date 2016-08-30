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

io.on('connection',function(socket){
    console.log('Client connected ... Sede: ' + socket.sede);
    clients[socket.sede] = socket;
    //on start load latest notification for specific client
    Notification.getLatestNotificationBySede(socket.sede, function(err, notification){
        console.log("id sede", socket.sede);
        console.log("notificacion primera" , notification);
        if(!err) {
            socket.emit('latest-notification-changed',notification);
        }
    });
    events.on('new-latest-notification',function(notification){
        //if office id equals 3 , means all officies should get the new notification
        if(notification.office_id == 3){
            //broadcast to all
            console.log("paratodas las sedes", notification);
            socket.emit('latest-notification-changed',notification);
        }else{
            //emit to office
            console.log("para sede ", notification.office_id);
            //TODO VALIDATE IF SOCKET EXISTS!!!!
            clients[notification.office_id].emit('latest-notification-changed',notification);
        }
    });
    events.on('latest-notification-changed',function(notification){
        console.log("deleted notification", notification);
        //TODO change hardcoded values!!
        if(notification.office_id == 3){
            Notification.getLatestNotificationBySede(1,function(err,latestNotification){
                console.log("notification",latestNotification);
                clients['1'].emit('latest-notification-changed',latestNotification);
            });
            Notification.getLatestNotificationBySede(2,function(err,latestNotification){
                console.log("notification",latestNotification);
                clients['2'].emit('latest-notification-changed',latestNotification);
            });
        }else{
            Notification.getLatestNotificationBySede(notification.office_id,function(err,latestNotification){
                console.log("notification.office_id",notification.office_id);
                clients[notification.office_id].emit('latest-notification-changed',latestNotification);
            });
        }
    });
});
