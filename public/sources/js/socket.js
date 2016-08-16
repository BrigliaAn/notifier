$(document).ready(function(){
	var socket = io.connect('http://localhost:5000');
	var username = prompt('Ingrese nombre de la sede:');
	socket.emit('new_user',username);
	socket.on('notification-created',function(notification){
		console.log("Recived new notification from server", notification);
		$('#new_notification').append("<span>"+ notification.content+"</span>");
	});
	socket.on('message',function(message){
		console.log("Mesagge from server: ",message);
	});
	socket.on('latest-notification',function(notification){
		console.log("Latest notification from server",notification);
		$('#new_notification').append("<span>"+notification.content+"</span>");
	});
});
