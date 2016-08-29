var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
	title : String,
	content : String,
	office_id : Number,
	date : {type: Date, default: new Date(Date())},
	notified : {type:Boolean, default : false},
});


notificationSchema.statics.getLatestNotification = function(callback){
	this.findOne({'notified':false}).sort({'date': -1}).exec(function(err, result) {
		if (err) return callback(err);
        callback(null, result);
	});	
}

notificationSchema.statics.getLatestNotificationBySede = function(office_id,callback){
	this.findOne({'notified':false, 'office_id': { $in: [office_id, '3'] }}).sort({'date': -1}).exec(function(err, result) {
		if (err) return callback(err);
	    callback(null, result);
	});
}

notificationSchema.statics.getLatestNotifications = function(n,callback){
	this.find({}).sort({'date': -1}).limit(n).exec(function(err,result){
		if(err) return callback(err);
		callback(null,result);
	});
}

notificationSchema.methods.notify = function(callback){
	if(this.notified == true){
		this.notified = false;
	}else{
		this.notified = true;
	}
	return this;
}

var Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
