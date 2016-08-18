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
	Notification.getLatestNotification(function(err,result){
		res.render('./index.ejs', {layout:false, notification:result});
	});
});

module.exports = router;
