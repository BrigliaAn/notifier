 $(window).load(function(){
    $('#myModal').modal('show');
});

$(document).ready(function(){
	$("#button").click(function(){
		//var username = prompt('Ingrese nombre de la sede:');
		var username = $('#sede').val();
		var socket = io.connect('https://antotestapp.herokuapp.com', { query: 'sede=' + username });
		socket.on('latest-notification-changed',function(notification){
			//testing
			console.log("Latest notification from server",notification);

			//TODO change this
			$("#notification-title").html(notification.title);
			$("#notification-body").html(notification.content);
		});
	});
});


