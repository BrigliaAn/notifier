$(window).load(function(){
    $('#myModal').modal('show');
});

$(document).ready(function(){
	$("#button").click(function(){
		var username = $('#sede').val();
		var stack = [];
		var socket = io.connect('http://localhost:5000', { query: 'sede=' + username });
		socket.on('latest-notification-changed',function(notification){
			//testing
			console.log("Latest notification from server",notification);

			//TODO change this
			$("#notification-title").html(notification.title);
			$("#notification-body").html(notification.content);
		});
	});
});


