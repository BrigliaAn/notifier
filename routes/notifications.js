//Global requires
var express = require('express');

//Local requires
var Notification = require('../model/notification.js');

//inits
var router = express.Router();

function getEventEmmiter(request) {
	return request.app.get('notificationsEvents');
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.use(function (req,res,next){
	console.log('/'+req.method);
	next();
});

router.get('/',isAuthenticated,function(req,res){
	Notification.getLatestNotifications(4,function(err,latestNotifications){
		if(!err){
			res.render('./admin', {user: req.user, notifications : latestNotifications});
		}
		if(!latestNotifications){
			res.render('./admin', {user: req.user,notifications : null});
		}
	});
});

router.get('/create',isAuthenticated,function(req,res){
	res.render('./create',{user: req.user});
});

router.get('/list',isAuthenticated,function(req,res){
	Notification.find({}).sort({'date': -1}).exec(function(err, result) {
  		if(err){
  			console.log(err);
  		}
		res.render('./list', {user:req.user,notifications: result});
	})
});

router.get('/showDetails/:id',isAuthenticated,function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.render('details',{layout: false,user: req.user,notification:result});
	});
});

router.post('/createNotification',isAuthenticated,function(req,res){
	var event = getEventEmmiter(req);
	Notification.create({title:req.body.title,content:req.body.content,office_id:req.body.office_id,date:new Date(Date())},function(err,result){
		if (err) throw err;
		console.log('Notification saved successfully!');
		event.emit('new-latest-notification', result);
	});
	res.redirect('/notifications/list');
});

router.get('/delete/:id',isAuthenticated,function(req,res){
	var event = getEventEmmiter(req);
	Notification.getLatestNotification(function(latestError,latestNotification){
		var latestNotification = latestNotification;
		Notification.findOneAndRemove({_id:req.params.id},function(err,result){
			if(err) console.log(err);
			var deletedNotification = result;
			if(deletedNotification.id == latestNotification.id){
				event.emit('latest-notification-changed', deletedNotification);
			}	
			res.redirect('/notifications/list');
		});
	});

});

router.get('/edit/:id',isAuthenticated,function(req,res){
	Notification.findOne({_id:req.params.id},function(err,result){
		if(err) console.log(err);
		res.render('./edit',{notification: result,user: req.user});
	});
});

router.post('/edit/:id',isAuthenticated,function(req,res){
	var event = getEventEmmiter(req);
	Notification.getLatestNotification(function(latestError,latestNotification){
		var latestNotification = latestNotification;
		Notification.findOneAndUpdate({_id:req.params.id},{title:req.body.title,content:req.body.content,office_id:req.body.office_id},
			function(err,result){
				if(err) console.log(err);
				var editedNotification = result;
				if(editedNotification.id == latestNotification.id){
					Notification.getLatestNotification(function(error, newLatestNotification) {
						if(error) console.log(err);
						event.emit('new-latest-notification',newLatestNotification);
					});
				}
		});
	res.redirect('/notifications/list');
	});
});

router.get('/notify/:id',isAuthenticated,function(req,res){
	var event = getEventEmmiter(req);
	Notification.findOne({_id:req.params.id},function(err,result){
		notificationId = result.id;
		if(err) console.log(err);
		result.notify().save().then(function() {
			Notification.getLatestNotification(function(err,latestNotification){
				if(latestNotification.id == result.id || result.notified == true){
					event.emit('latest-notification-changed',result);
				}
			});
			res.redirect('/notifications/list');			
		});
	});
});

router.get('/resend/:id',isAuthenticated,function(req,res){
	var event = getEventEmmiter(req);
	Notification.findOneAndUpdate({_id:req.params.id},{date: new Date(Date()),notified:false},function(err,result){
		if(err) console.log(err);
		event.emit('new-latest-notification',result);
		res.redirect('/notifications/list');
	});
});

module.exports = router;
