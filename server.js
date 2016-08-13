const express = require('express');
const app = express();
var router = express.Router();

var views_path = __dirname + '/views/';

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('view engine', 'ejs');

var config = require('./config.global');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri,function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + config.mongo.uri + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + config.mongo.uri);
	}
});

var Notification = require(__dirname +'/model/notification.js');

router.use(function(req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/create',function(req,res){
	res.sendFile(views_path + 'create.html');
});

router.post('/createNotification',function(req,res){
	 Notification.create({title:req.body.title,content:req.body.content,office_id:req.body.office_id},function(err){
		if (err) throw err;
  		console.log('User saved successfully!');
	});
	res.redirect('/list');
});


router.get('/',function(req,res){
	Notification.find({}).sort({'date': -1}).limit(6).exec(function(err, result) {
  		if(err){
  			console.log(err);
  		}
  		console.log(result[2]);
  		res.render(views_path + 'admin.ejs', {notifications: result});
	})
});


router.get('/index',function(req,res){
	res.sendFile(views_path + 'index.html');
});

router.get('/create',function(req,res){
	res.sendFile(views_path + 'create.html');
});

router.get('/list',function(req,res){
	Notification.find({}).sort({'date': -1}).limit(50).exec(function(err, result) {
  		if(err){
  			console.log(err);
  		}
		res.render(views_path + 'list.ejs', {notifications: result});
	})
});

router.get('/notify/:id',function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		if(result.notified == false){
			result.notified = true;
		}else{
			result.notified = false;
		}
		result.save();
		res.redirect('/list'); 
	});
});

router.get('/delete/:id',function(req,res){
	Notification.findOneAndRemove({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.redirect('/list');
	});
});

router.get('/edit/:id',function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.render('edit.ejs',{notification: result});
	});
});

router.post('/edit/:id',function(req,res){
	Notification.findOneAndUpdate({_id:req.params.id},{title:req.body.title,content:req.body.content,office_id:req.body.office_id},
		function(err,result){
		if(err) console.log(err);
		res.redirect('/list');
	});
});


app.use('/',router);
app.use(express.static(__dirname + '/public'));

//app.use("*",function(req,res){
// 	res.sendFile(views_path + "404.html");
//});

app.listen(process.env.PORT || config.port, function() {
    console.log('listening on ' + config.port)
});






