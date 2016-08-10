$(document).ready(function() {
	var date = moment().format('DD/MM');
    var time = moment().format('HH:mm');
    document.getElementById('date').innerHTML=date;
	document.getElementById('time').innerHTML=time;
});