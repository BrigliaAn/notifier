var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
	title : String,
	content : String,
	office_id : Number,
	date : {type: Date, default: new Date(Date())},
	notified : {type:Boolean, default : false},
});

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;