function getCurrentDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  today = dd+'/'+mm+'/'+yyyy;
  return today;
};

function getCurrentTime(){
  var date = new Date(); 
  return (date.getHours() + ':' + date.getMinutes());
};

function getCurrentMonth(){
  var today = new Date();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(mm<10) {
      mm='0'+mm
  } 

  today = mm+'-'+yyyy;
  return today;
}

$(document).ready(function(){

  $('.details').click(function(){
    $.ajax({url: "/notifications/showDetails/"+$(this).data('id'),
      success: 
        function(data){
          $("#details").html(data);
      }
    });
  });

});