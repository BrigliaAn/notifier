//Global requires
var express = require('express');

//Local requires
var Notification = require('../model/notification.js');

//inits
var router = express.Router();

router.use(function (req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/',function(req,res){
	Notification.find({}).sort({'date': -1}).limit(6).exec(function(err, result) {
  		if(err){
  			console.log(err);
  		}
  		res.render('./admin', {notifications: result});
	})
});

router.post('/createNotification',function(req,res){
	 Notification.create({title:req.body.title,content:req.body.content,office_id:req.body.office_id},function(err){
		if (err) throw err;
  		console.log('User saved successfully!');
	});
	res.redirect('./list');
});

router.get('/index',function(req,res){
	res.sendFile('./index.html');
});

router.get('/create',function(req,res){
	res.render('./create');
});

router.get('/list',function(req,res){
	Notification.find({}).sort({'date': -1}).limit(50).exec(function(err, result) {
  		if(err){
  			console.log(err);
  		}
		res.render('./list', {notifications: result});
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
		res.redirect('/notifications/list'); 
	});
});

router.get('/delete/:id',function(req,res){
	Notification.findOneAndRemove({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.redirect('/notifications/list');
	});
});

router.get('/edit/:id',function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.render('./edit',{notification: result});
	});
});

router.post('/edit/:id',function(req,res){
	Notification.findOneAndUpdate({_id:req.params.id},{title:req.body.title,content:req.body.content,office_id:req.body.office_id},
		function(err,result){
		if(err) console.log(err);
		res.redirect('/notifications/list');
	});
});

router.get('/showDetails/:id',function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.render('details',{layout: false,notification:result});
	});
});

module.exports = router;