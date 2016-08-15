var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config.global');
var ejsLayouts = require("express-ejs-layouts");
var notifications = require('./routes/notifications.js');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views/'));

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
app.use('/notifications', notifications);
app.use(express.static(__dirname + '/public'));

//app.use("*",function(req,res){
// 	res.sendFile(views_path + "404.html");
//});

app.listen(process.env.PORT || config.port, function() {
    console.log('listening on ' + config.port)
});






