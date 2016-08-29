var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
	title : String,
	content : String,
	office_id : Number,
	date : {type: Date, default: new Date(Date())},
	notified : {type:Boolean, default : false},
});


var Notification = mongoose.model('Notification', notificationSchema);

Notification.getLatestNotification = function(callback){
	Notification.findOne({'notified':false}).sort({'date': -1}).exec(function(err, result) {
		console.log('Latest notification',result);
		if (err) return callback(err);
        callback(null, result);
	});
}

Notification.getLatestNotificationBySede = function(sede,callback){
	Notification.findOne({'notified':false, 'office_id':sede}).sort({'date': -1}).exec(function(err, result) {
		console.log('Latest notification',result);
		if (err) return callback(err);
        callback(null, result);
	});
}


module.exports = Notification;
