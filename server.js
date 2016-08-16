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


mongoose.connect(config.mongo.uri,function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + config.mongo.uri);
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

io.sockets.on('connection', function(socket,username) {  
    console.log('Client connected...');
    socket.emit('message', 'You are conected');
    socket.broadcast.emit('message','New connection stablished');
    
    socket.on('new_user',function(username){
    	console.log('New user connected with username: ',username);
    	socket.username = username;
    });
    events.on('latest-notification',function(notification){
    	console.log("This is the lastest notification", notification);
    	socket.emit('latest-notification',notification);
    });
    events.on('notification-created',function(notification){
    	console.log('New notification created');
    	socket.emit('notification-created', notification);
    });
});







