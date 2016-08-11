const express = require('express');
const app = express();
var router = express.Router();
var path = __dirname + '/views/';

//var bodyParser = require('body-parser');
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//var Notification = require('./model/notification.js');

router.use(function(req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/',function(req,res){
	res.sendFile(path +'admin.html');
});

router.get('/index',function(req,res){
	res.sendFile(path + 'index.html');
});

router.get('/create',function(req,res){
	res.sendFile(path + 'create.html');
});

router.get('/list',function(req,res){
	res.sendFile(path + 'list.html');
});

router.post('/createNotification',function(req,res){
	res.sendFile(path + 'list.html');
});

app.use('/',router);
app.use(express.static(__dirname + '/public'));

//app.use("*",function(req,res){
// 	res.sendFile(path + "404.html");
//});

app.listen(process.env.PORT || 5000);

//app.listen(3000,function(){
//	console.log('Listening on port 3000');
//})







